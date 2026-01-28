from typing import TypeVar, Generic, List, Optional, Tuple
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
import base64
import json


T = TypeVar('T')


class CursorPaginationParams(BaseModel):
    """游标分页参数"""
    cursor: Optional[str] = None  # Base64编码的游标
    limit: int = 20  # 每页数量，默认20


class CursorPaginationResult(Generic[T]):
    """游标分页结果"""
    items: List[T]
    next_cursor: Optional[str]
    has_more: bool


def encode_cursor(data: dict) -> str:
    """将游标数据编码为字符串"""
    json_str = json.dumps(data, default=str)
    return base64.b64encode(json_str.encode()).decode()


def decode_cursor(cursor_str: str) -> dict:
    """解码游标字符串为数据"""
    try:
        decoded_bytes = base64.b64decode(cursor_str.encode())
        return json.loads(decoded_bytes.decode())
    except Exception:
        return {}


def paginate_with_cursor(
    query,
    cursor_params: CursorPaginationParams,
    sort_field: str,
    item_class=None
) -> CursorPaginationResult:
    """
    使用游标进行分页
    
    Args:
        query: SQLAlchemy查询对象
        cursor_params: 游标分页参数
        sort_field: 用于排序的字段名
        item_class: 可选的Pydantic类，用于转换结果
    
    Returns:
        CursorPaginationResult: 包含分页结果的对象
    """
    # 应用限制，多取一项来判断是否有更多数据
    query = query.order_by(sort_field).limit(cursor_params.limit + 1)
    
    # 如果有游标，应用游标条件
    if cursor_params.cursor:
        cursor_data = decode_cursor(cursor_params.cursor)
        cursor_value = cursor_data.get('value')
        
        if cursor_value is not None:
            # 对于时间类型的字段，需要特殊处理
            if isinstance(cursor_value, str) and 'T' in cursor_value:
                cursor_value = datetime.fromisoformat(cursor_value.replace('Z', '+00:00'))
            
            query = query.filter(sort_field > cursor_value)
    
    # 执行查询
    results = query.all()
    
    # 检查是否还有更多数据
    has_more = len(results) > cursor_params.limit
    if has_more:
        # 移除多取的一项
        results = results[:-1]
    
    # 获取下一页的游标
    next_cursor = None
    if results and has_more:
        last_item = results[-1]
        # 获取排序字段的值
        if hasattr(last_item, sort_field.name):
            cursor_value = getattr(last_item, sort_field.name)
        else:
            # 如果是元组或其他类型，需要特殊处理
            cursor_value = last_item[sort_field.name] if isinstance(last_item, tuple) else last_item
        
        # 构造游标数据
        cursor_data = {
            'field': sort_field.name,
            'value': cursor_value
        }
        next_cursor = encode_cursor(cursor_data)
    
    # 转换结果
    if item_class:
        results = [item_class.model_validate(result) for result in results]
    
    return CursorPaginationResult(
        items=results,
        next_cursor=next_cursor,
        has_more=has_more
    )