"""
API端点测试脚本
测试所有主要的API接口，确保数据正确返回
"""
import requests
import json
from datetime import datetime


class APITester:
    """API测试器"""
    
    def __init__(self, base_url="http://localhost:8000/api/v1"):
        self.base_url = base_url
        self.token = None
        self.headers = {}
    
    def print_section(self, title):
        """打印测试区域标题"""
        print("\n" + "=" * 60)
        print(f" {title}")
        print("=" * 60)
    
    def print_result(self, method, endpoint, status_code, success=True):
        """打印测试结果"""
        status_icon = "✓" if success else "✗"
        print(f"{status_icon} {method:6s} {endpoint:40s} - 状态码: {status_code}")
    
    def login(self, username="admin", password="admin123"):
        """登录获取token"""
        self.print_section("认证接口测试")
        
        login_data = {
            "username": username,
            "password": password
        }
        
        response = requests.post(f"{self.base_url}/auth/login-json", json=login_data)
        self.print_result("POST", "/auth/login-json", response.status_code, response.status_code == 200)
        
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
            print(f"  获取到Token: {self.token[:20]}..." if self.token else "  未获取到Token")
            return True
        else:
            print(f"  错误: {response.text}")
            return False
    
    def register_user(self):
        """测试注册用户"""
        self.print_section("用户注册测试")
        
        user_data = {
            "username": f"testuser_{datetime.now().timestamp()}",
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "password": "test123456",
            "full_name": "测试用户"
        }
        
        response = requests.post(f"{self.base_url}/auth/register", json=user_data)
        self.print_result("POST", "/auth/register", response.status_code, response.status_code == 200)
        
        if response.status_code == 200:
            print(f"  用户ID: {response.json().get('user_id')}")
    
    def test_user_endpoints(self):
        """测试用户相关接口"""
        self.print_section("用户接口测试")
        
        if not self.token:
            print("  跳过: 未登录")
            return
        
        # 获取当前用户信息
        response = requests.get(f"{self.base_url}/users/me", headers=self.headers)
        self.print_result("GET", "/users/me", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            user = response.json()
            print(f"  用户名: {user.get('username')}")
            print(f"  邮箱: {user.get('email')}")
        
        # 获取用户统计
        response = requests.get(f"{self.base_url}/users/me/stats", headers=self.headers)
        self.print_result("GET", "/users/me/stats", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            stats = response.json()
            print(f"  文章数: {stats.get('article_count', 0)}")
            print(f"  评论数: {stats.get('comment_count', 0)}")
        
        # 测试密码更新
        password_data = {
            "old_password": "admin123",
            "new_password": "newadmin123"
        }
        response = requests.put(f"{self.base_url}/users/me/password", headers=self.headers, json=password_data)
        self.print_result("PUT", "/users/me/password", response.status_code, response.status_code == 200)
        
        # 恢复密码
        password_data = {
            "old_password": "newadmin123",
            "new_password": "admin123"
        }
        requests.put(f"{self.base_url}/users/me/password", headers=self.headers, json=password_data)
    
    def test_article_endpoints(self):
        """测试文章相关接口"""
        self.print_section("文章接口测试")
        
        # 获取文章列表
        response = requests.get(f"{self.base_url}/articles/")
        self.print_result("GET", "/articles/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            articles = response.json()
            print(f"  获取到 {len(articles)} 篇文章")
            if articles:
                print(f"  第一篇文章: {articles[0].get('title', 'N/A')}")
        
        # 获取精选文章
        response = requests.get(f"{self.base_url}/articles/featured")
        self.print_result("GET", "/articles/featured", response.status_code, response.status_code == 200)
        
        # 获取热门文章
        response = requests.get(f"{self.base_url}/articles/popular")
        self.print_result("GET", "/articles/popular", response.status_code, response.status_code == 200)
        
        # 搜索文章
        response = requests.get(f"{self.base_url}/articles/search?query=FastAPI")
        self.print_result("GET", "/articles/search", response.status_code, response.status_code == 200)
        
        # 获取第一篇文章详情
        response = requests.get(f"{self.base_url}/articles/")
        if response.status_code == 200:
            articles = response.json()
            if articles:
                article_id = articles[0].get('id')
                if article_id:
                    response = requests.get(f"{self.base_url}/articles/{article_id}")
                    self.print_result("GET", f"/articles/{article_id}", response.status_code, response.status_code == 200)
    
    def test_category_endpoints(self):
        """测试分类接口"""
        self.print_section("分类接口测试")
        
        # 获取分类列表
        response = requests.get(f"{self.base_url}/categories/")
        self.print_result("GET", "/categories/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            categories = response.json()
            print(f"  获取到 {len(categories)} 个分类")
            for cat in categories[:3]:
                print(f"    - {cat.get('name')}: {cat.get('slug')}")
    
    def test_tag_endpoints(self):
        """测试标签接口"""
        self.print_section("标签接口测试")
        
        # 获取标签列表
        response = requests.get(f"{self.base_url}/tags/")
        self.print_result("GET", "/tags/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            tags = response.json()
            print(f"  获取到 {len(tags)} 个标签")
            for tag in tags[:5]:
                print(f"    - {tag.get('name')}: {tag.get('slug')}")
    
    def test_comment_endpoints(self):
        """测试评论接口"""
        self.print_section("评论接口测试")
        
        # 获取评论列表
        response = requests.get(f"{self.base_url}/comments/")
        self.print_result("GET", "/comments/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            comments = response.json()
            print(f"  获取到 {len(comments)} 条评论")
        
        # 获取评论数量
        response = requests.get(f"{self.base_url}/comments/count")
        self.print_result("GET", "/comments/count", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            count = response.json()
            print(f"  评论总数: {count}")
    
    def test_message_endpoints(self):
        """测试留言接口"""
        self.print_section("留言接口测试")
        
        # 获取留言列表
        response = requests.get(f"{self.base_url}/messages/")
        self.print_result("GET", "/messages/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            messages = response.json()
            print(f"  获取到 {len(messages)} 条留言")
        
        # 获取弹幕留言
        response = requests.get(f"{self.base_url}/messages/danmaku")
        self.print_result("GET", "/messages/danmaku", response.status_code, response.status_code == 200)
        
        if self.token:
            # 测试创建留言
            message_data = {
                "content": "API测试留言",
                "is_danmaku": False
            }
            response = requests.post(f"{self.base_url}/messages/", headers=self.headers, json=message_data)
            self.print_result("POST", "/messages/", response.status_code, response.status_code in [200, 201])
            
            if response.status_code in [200, 201]:
                message_id = response.json().get('id')
                
                # 测试点赞留言
                response = requests.post(f"{self.base_url}/messages/{message_id}/like", headers=self.headers)
                self.print_result("POST", f"/messages/{message_id}/like", response.status_code, response.status_code == 200)
                
                # 测试取消点赞
                response = requests.post(f"{self.base_url}/messages/{message_id}/unlike", headers=self.headers)
                self.print_result("POST", f"/messages/{message_id}/unlike", response.status_code, response.status_code == 200)
    
    def test_friend_link_endpoints(self):
        """测试友链接口"""
        self.print_section("友链接口测试")
        
        # 获取友链列表
        response = requests.get(f"{self.base_url}/friend-links/")
        self.print_result("GET", "/friend-links/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            links = response.json()
            print(f"  获取到 {len(links)} 个友链")
            featured = [l for l in links if l.get('is_featured')]
            print(f"  其中 {len(featured)} 个为推荐友链")
            
            if links:
                # 测试点击追踪
                link_id = links[0].get('id')
                response = requests.post(f"{self.base_url}/friend-links/{link_id}/click")
                self.print_result("POST", f"/friend-links/{link_id}/click", response.status_code, response.status_code == 200)
    
    def test_subscription_endpoints(self):
        """测试订阅接口"""
        self.print_section("订阅接口测试")
        
        # 获取订阅者数量
        response = requests.get(f"{self.base_url}/subscriptions/count")
        self.print_result("GET", "/subscriptions/count", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            count = response.json()
            print(f"  当前订阅者数量: {count}")
        
        if self.token:
            # 获取订阅列表（需要管理员权限）
            response = requests.get(f"{self.base_url}/subscriptions/", headers=self.headers)
            self.print_result("GET", "/subscriptions/", response.status_code, response.status_code == 200)
        
        # 测试创建订阅
        sub_data = {"email": "api_test@example.com"}
        response = requests.post(f"{self.base_url}/subscriptions/", json=sub_data)
        self.print_result("POST", "/subscriptions/", response.status_code, response.status_code == 200)
        
        if response.status_code == 200:
            # 测试取消订阅
            response = requests.post(f"{self.base_url}/subscriptions/unsubscribe", params={"email": "api_test@example.com"})
            self.print_result("POST", "/subscriptions/unsubscribe", response.status_code, response.status_code == 200)
    
    def test_timeline_endpoints(self):
        """测试时间轴接口"""
        self.print_section("时间轴接口测试")
        
        # 获取时间轴事件
        response = requests.get(f"{self.base_url}/timeline-events/")
        self.print_result("GET", "/timeline-events/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            events = response.json()
            print(f"  获取到 {len(events)} 个时间轴事件")
            for event in events[:3]:
                print(f"    - {event.get('event_date')}: {event.get('title')}")
    
    def test_typewriter_endpoints(self):
        """测试打字机内容接口"""
        self.print_section("打字机内容接口测试")
        
        # 获取打字机内容
        response = requests.get(f"{self.base_url}/typewriter-contents/")
        self.print_result("GET", "/typewriter-contents/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            result = response.json()
            contents = result.get('contents', [])
            print(f"  获取到 {len(contents)} 条打字机内容")
            for content in contents[:3]:
                print(f"    - {content.get('text')}")
    
    def test_portfolio_endpoints(self):
        """测试作品集接口"""
        self.print_section("作品集接口测试")
        
        # 获取作品集列表
        response = requests.get(f"{self.base_url}/portfolios/")
        self.print_result("GET", "/portfolios/", response.status_code, response.status_code == 200)
        if response.status_code == 200:
            portfolios = response.json()
            print(f"  获取到 {len(portfolios)} 个作品集")
            
            if portfolios:
                portfolio_id = portfolios[0].get('id')
                # 获取作品集详情
                response = requests.get(f"{self.base_url}/portfolios/{portfolio_id}")
                self.print_result("GET", f"/portfolios/{portfolio_id}", response.status_code, response.status_code == 200)
                
                # 获取作品集图片
                response = requests.get(f"{self.base_url}/portfolios/{portfolio_id}/images")
                self.print_result("GET", f"/portfolios/{portfolio_id}/images", response.status_code, response.status_code == 200)
    
    def run_all_tests(self):
        """运行所有测试"""
        print("\n" + "█" * 60)
        print("█" + " " * 58 + "█")
        print("█" + "  My Awesome Blog - API接口测试".center(52, " ") + "█")
        print("█" + " " * 58 + "█")
        print("█" * 60)
        print("\n开始时间:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        
        success_count = 0
        fail_count = 0
        
        # 1. 注册测试用户
        try:
            self.register_user()
            success_count += 1
        except Exception as e:
            print(f"  注册测试失败: {e}")
            fail_count += 1
        
        # 2. 登录
        try:
            if self.login():
                success_count += 1
            else:
                fail_count += 1
        except Exception as e:
            print(f"  登录测试失败: {e}")
            fail_count += 1
        
        # 3. 测试用户接口
        try:
            self.test_user_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  用户接口测试失败: {e}")
            fail_count += 1
        
        # 4. 测试文章接口
        try:
            self.test_article_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  文章接口测试失败: {e}")
            fail_count += 1
        
        # 5. 测试分类接口
        try:
            self.test_category_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  分类接口测试失败: {e}")
            fail_count += 1
        
        # 6. 测试标签接口
        try:
            self.test_tag_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  标签接口测试失败: {e}")
            fail_count += 1
        
        # 7. 测试评论接口
        try:
            self.test_comment_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  评论接口测试失败: {e}")
            fail_count += 1
        
        # 8. 测试留言接口
        try:
            self.test_message_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  留言接口测试失败: {e}")
            fail_count += 1
        
        # 9. 测试友链接口
        try:
            self.test_friend_link_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  友链接口测试失败: {e}")
            fail_count += 1
        
        # 10. 测试订阅接口
        try:
            self.test_subscription_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  订阅接口测试失败: {e}")
            fail_count += 1
        
        # 11. 测试时间轴接口
        try:
            self.test_timeline_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  时间轴接口测试失败: {e}")
            fail_count += 1
        
        # 12. 测试打字机内容接口
        try:
            self.test_typewriter_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  打字机内容接口测试失败: {e}")
            fail_count += 1
        
        # 13. 测试作品集接口
        try:
            self.test_portfolio_endpoints()
            success_count += 1
        except Exception as e:
            print(f"  作品集接口测试失败: {e}")
            fail_count += 1
        
        print("\n" + "=" * 60)
        print("测试总结")
        print("=" * 60)
        print(f"成功: {success_count}")
        print(f"失败: {fail_count}")
        print(f"总计: {success_count + fail_count}")
        print(f"成功率: {(success_count / (success_count + fail_count) * 100):.1f}%")
        print("\n结束时间:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        print("=" * 60)


def main():
    """主函数"""
    import sys
    from app.core.config import settings
    
    base_url = settings.get("BACKEND_URL", "http://localhost:8000/api/v1")
    if not base_url.startswith("http"):
        base_url = f"http://{base_url}"
    
    tester = APITester(base_url)
    tester.run_all_tests()


if __name__ == "__main__":
    main()
