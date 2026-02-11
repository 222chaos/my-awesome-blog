"""
Prompt Optimizer
Prompt 优化器，提供 Prompt 内容优化功能
"""

from typing import List, Optional
import re
from app.utils.logger import app_logger


class PromptOptimizer:
    """
    Prompt 优化器
    
    提供 Prompt 内容的优化和格式化功能
    """
    
    @staticmethod
    def remove_redundant_whitespace(content: str) -> str:
        """
        移除冗余空格
        
        Args:
            content: 原始内容
        
        Returns:
            str: 优化后的内容
        """
        content = re.sub(r'[ \t]+', ' ', content)
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip()
        return content
    
    @staticmethod
    def normalize_line_breaks(content: str) -> str:
        """
        规范化换行符
        
        Args:
            content: 原始内容
        
        Returns:
            str: 规范化后的内容
        """
        content = content.replace('\r\n', '\n')
        content = content.replace('\r', '\n')
        return content
    
    @staticmethod
    def truncate_long_lines(
        content: str,
        max_line_length: int = 100
    ) -> str:
        """
        截断过长的行
        
        Args:
            content: 原始内容
            max_line_length: 最大行长度
        
        Returns:
            str: 截断后的内容
        """
        lines = content.split('\n')
        result = []
        
        for line in lines:
            if len(line) > max_line_length:
                words = line.split(' ')
                current_line = ""
                
                for word in words:
                    if len(current_line) + len(word) + 1 > max_line_length:
                        result.append(current_line)
                        current_line = word
                    else:
                        current_line += (' ' if current_line else '') + word
                
                if current_line:
                    result.append(current_line)
            else:
                result.append(line)
        
        return '\n'.join(result)
    
    @staticmethod
    def remove_duplicate_empty_lines(content: str) -> str:
        """
        移除重复的空行
        
        Args:
            content: 原始内容
        
        Returns:
            str: 优化后的内容
        """
        lines = content.split('\n')
        result = []
        prev_empty = False
        
        for line in lines:
            is_empty = not line.strip()
            if not (is_empty and prev_empty):
                result.append(line)
            prev_empty = is_empty
        
        return '\n'.join(result)
    
    @staticmethod
    def optimize_structure(content: str) -> str:
        """
        优化 Prompt 结构
        
        确保合理的段落分隔和格式
        
        Args:
            content: 原始内容
        
        Returns:
            str: 优化后的内容
        """
        content = PromptOptimizer.remove_redundant_whitespace(content)
        content = PromptOptimizer.normalize_line_breaks(content)
        content = PromptOptimizer.remove_duplicate_empty_lines(content)
        
        return content
    
    @staticmethod
    def compress(content: str, target_length: int) -> str:
        """
        压缩 Prompt 内容到指定长度
        
        尽量保留关键信息
        
        Args:
            content: 原始内容
            target_length: 目标长度
        
        Returns:
            str: 压缩后的内容
        """
        if len(content) <= target_length:
            return content
        
        sentences = re.split(r'[.!?。！？]', content)
        result = []
        current_length = 0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            if current_length + len(sentence) <= target_length:
                result.append(sentence)
                current_length += len(sentence)
            elif current_length < target_length:
                remaining = target_length - current_length
                truncated = sentence[:remaining] + "..."
                result.append(truncated)
                break
            else:
                break
        
        return ' '.join(result) + ('...' if len(result) < len(sentences) else '')
    
    @staticmethod
    def validate_syntax(content: str) -> List[str]:
        """
        验证 Prompt 语法
        
        检查常见的语法问题
        
        Args:
            content: 要验证的内容
        
        Returns:
            List[str]: 问题列表
        """
        issues = []
        
        unmatched_open = re.findall(r'\{\{(?!\})\}', content)
        if unmatched_open:
            issues.append(f"未闭合的变量占位符: {', '.join(unmatched_open)}")
        
        unmatched_close = re.findall(r'\}(?!\{)', content)
        if unmatched_close:
            issues.append(f"未闭合的变量占位符: {', '.join(unmatched_close)}")
        
        if content.count('{{') != content.count('}}'):
            issues.append("不匹配的双大括号数量")
        
        if content.count('{{') > 0 and content.count('}}') > 0:
            parts = content.split('{{')
            if len(parts) > 1:
                first_part = parts[1]
                if '}}' not in first_part:
                    issues.append("双大括号未正确闭合")
        
        return issues
    
    @staticmethod
    def extract_variables(content: str) -> List[str]:
        """
        提取 Prompt 中的变量
        
        Args:
            content: Prompt 内容
        
        Returns:
            List[str]: 变量名列表
        """
        variables = re.findall(r'\{\{(\w+)\}\}|\\$\\(\\w+\\)', content)
        return list(set(variables))
    
    @staticmethod
    def format_for_display(content: str, max_preview_length: int = 200) -> str:
        """
        格式化内容用于显示
        
        Args:
            content: 原始内容
            max_preview_length: 最大预览长度
        
        Returns:
            str: 格式化后的预览内容
        """
        if len(content) <= max_preview_length:
            return content
        
        return content[:max_preview_length] + "..."
