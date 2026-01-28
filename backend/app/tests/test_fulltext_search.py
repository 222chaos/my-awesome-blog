import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app import crud
from app.models.article import Article
from app.models.user import User
from uuid import uuid4


@pytest.fixture
def client():
    """创建测试客户端"""
    with TestClient(app) as test_client:
        yield test_client


def test_fulltext_search_articles(superuser_token_headers, client: TestClient, db: Session):
    """测试全文搜索功能"""
    # 创建一个测试文章
    user = crud.get_users(db, limit=1)[0]
    test_article = {
        "title": "Advanced Python Techniques for Data Science",
        "slug": f"advanced-python-{uuid4()}",
        "content": "This article covers advanced Python techniques that are essential for data science projects. "
                   "We'll explore pandas, numpy, and scikit-learn in depth.",
        "excerpt": "Learn advanced Python techniques for data science",
        "is_published": True
    }
    
    # 通过API创建文章
    response = client.post(
        "/api/v1/articles/",
        json=test_article,
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    article_data = response.json()
    article_id = article_data["id"]
    
    # 等待一段时间让搜索向量更新（如果使用触发器）
    # 或者直接在创建后更新搜索向量（取决于实现）
    
    # 测试全文搜索
    search_response = client.get(
        "/api/v1/articles/search-fulltext",
        params={"search_query": "Python data science"},
        headers=superuser_token_headers
    )
    
    assert search_response.status_code == 200
    search_results = search_response.json()
    
    # 检查结果中是否包含我们创建的文章
    found_article = next((art for art in search_results if art["id"] == article_id), None)
    assert found_article is not None
    assert "Python" in found_article["title"] or "Python" in found_article["content"]
    

def test_fulltext_search_with_unpublished_articles(superuser_token_headers, client: TestClient, db: Session):
    """测试全文搜索是否正确处理已发布和未发布的文章"""
    # 创建一个已发布的文章
    user = crud.get_users(db, limit=1)[0]
    published_article = {
        "title": "Published Python Tips",
        "slug": f"published-python-tips-{uuid4()}",
        "content": "These are some great tips for Python programming that have been published.",
        "excerpt": "Great Python tips",
        "is_published": True
    }
    
    # 创建一个未发布的文章
    unpublished_article = {
        "title": "Unpublished Python Tips",
        "slug": f"unpublished-python-tips-{uuid4()}",
        "content": "These are some Python tips that are not yet published.",
        "excerpt": "Unpublished Python tips",
        "is_published": False
    }
    
    # 通过API创建文章
    pub_resp = client.post(
        "/api/v1/articles/",
        json=published_article,
        headers=superuser_token_headers
    )
    assert pub_resp.status_code == 200
    published_article_data = pub_resp.json()
    
    unpub_resp = client.post(
        "/api/v1/articles/",
        json=unpublished_article,
        headers=superuser_token_headers
    )
    assert unpub_resp.status_code == 200
    unpublished_article_data = unpub_resp.json()
    
    # 搜索包含这两个关键词的内容
    search_response = client.get(
        "/api/v1/articles/search-fulltext",
        params={"search_query": "Python tips", "published_only": True},
        headers=superuser_token_headers
    )
    
    assert search_response.status_code == 200
    search_results = search_response.json()
    
    # 检查结果中是否只包含已发布的文章
    pub_found = next((art for art in search_results if art["id"] == published_article_data["id"]), None)
    unpub_found = next((art for art in search_results if art["id"] == unpublished_article_data["id"]), None)
    
    assert pub_found is not None  # 已发布的文章应该在结果中
    assert unpub_found is None  # 未发布的文章不应该在结果中


def test_fulltext_search_empty_query(superuser_token_headers, client: TestClient):
    """测试空查询的处理"""
    response = client.get(
        "/api/v1/articles/search-fulltext",
        params={"search_query": ""},
        headers=superuser_token_headers
    )
    
    # 空查询应该返回422错误（验证错误）
    assert response.status_code == 422


def test_fulltext_search_special_characters(superuser_token_headers, client: TestClient, db: Session):
    """测试包含特殊字符的搜索查询"""
    # 创建一个包含特殊字符的文章标题
    user = crud.get_users(db, limit=1)[0]
    special_article = {
        "title": "Python's Advanced Features: Async/Await & More!",
        "slug": f"python-special-chars-{uuid4()}",
        "content": "Exploring Python's advanced features like async/await, decorators, and more.",
        "excerpt": "Advanced Python features",
        "is_published": True
    }
    
    # 创建文章
    response = client.post(
        "/api/v1/articles/",
        json=special_article,
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    article_data = response.json()
    article_id = article_data["id"]
    
    # 搜索包含特殊字符的查询
    search_response = client.get(
        "/api/v1/articles/search-fulltext",
        params={"search_query": "Python's async/await"},
        headers=superuser_token_headers
    )
    
    assert search_response.status_code == 200
    search_results = search_response.json()
    
    # 检查结果中是否包含我们创建的文章
    found_article = next((art for art in search_results if art["id"] == article_id), None)
    assert found_article is not None