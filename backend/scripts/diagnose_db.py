#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
数据库诊断脚本 - 用于诊断 PostgreSQL 连接问题
"""

import os
import sys
import socket
import subprocess

# 设置 UTF-8 环境以避免编码问题
os.environ['PYTHONUTF8'] = '1'
os.environ['PYTHONIOENCODING'] = 'UTF-8'

import psycopg2


class DatabaseDiagnostic:
    """数据库诊断类"""

    def __init__(self, host='localhost', port=5432, database='my_awesome_blog',
                 user='postgres', password='123456'):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password
        self.issues = []
        self.warnings = []

    def check_service_status(self):
        """检查 PostgreSQL 服务状态"""
        print("\n[1/5] 检查 PostgreSQL 服务状态...")

        try:
            # 尝试使用 sc 命令检查服务
            result = subprocess.run(
                ['sc', 'query', 'postgresql-x64-17'],
                capture_output=True,
                text=True,
                timeout=5
            )

            if 'RUNNING' in result.stdout:
                print("  [OK] PostgreSQL 服务正在运行")
                return True
            elif 'STOPPED' in result.stdout:
                print("  [ERROR] PostgreSQL 服务已停止")
                self.issues.append("PostgreSQL 服务未运行，请启动服务")
                return False
            else:
                print("  [WARN] 无法确定服务状态")
                self.warnings.append("无法确定 PostgreSQL 服务状态")
                return None

        except Exception as e:
            print(f"  [WARN] 无法检查服务状态: {e}")
            self.warnings.append(f"服务检查失败: {e}")
            return None

    def check_port_listening(self):
        """检查 PostgreSQL 端口是否在监听"""
        print(f"\n[2/5] 检查端口 {self.port} 是否在监听...")

        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((self.host, self.port))
            sock.close()

            if result == 0:
                print(f"  [OK] 端口 {self.port} 正在监听")
                return True
            else:
                print(f"  [ERROR] 端口 {self.port} 未监听")
                self.issues.append(f"PostgreSQL 端口 {self.port} 未在监听")
                return False

        except Exception as e:
            print(f"  [WARN] 端口检查失败: {e}")
            self.warnings.append(f"端口检查失败: {e}")
            return None

    def check_server_connection(self):
        """检查是否可以连接到 PostgreSQL 服务器"""
        print(f"\n[3/5] 检查服务器连接...")

        try:
            # 尝试连接到默认的 postgres 数据库
            conn = psycopg2.connect(
                host=self.host,
                port=self.port,
                database='postgres',  # 连接到默认数据库
                user=self.user,
                password=self.password,
                client_encoding='UTF8',
                connect_timeout=5
            )
            print("  [OK] 成功连接到 PostgreSQL 服务器")
            conn.close()
            return True

        except psycopg2.OperationalError as e:
            error_msg = str(e)
            if "password authentication failed" in error_msg:
                print("  [ERROR] 用户名或密码错误")
                self.issues.append(f"PostgreSQL 认证失败：用户名或密码不正确")
            elif "connection refused" in error_msg:
                print("  [ERROR] 连接被拒绝")
                self.issues.append("PostgreSQL 服务器拒绝连接")
            elif "could not connect to server" in error_msg:
                print("  [ERROR] 无法连接到服务器")
                self.issues.append("无法连接到 PostgreSQL 服务器")
            else:
                print(f"  [ERROR] 连接失败: {error_msg}")
                self.issues.append(f"连接错误: {error_msg}")
            return False

        except Exception as e:
            print(f"  [WARN] 连接检查失败: {e}")
            self.warnings.append(f"服务器连接检查失败: {e}")
            return None

    def check_database_exists(self):
        """检查目标数据库是否存在"""
        print(f"\n[4/5] 检查数据库 '{self.database}' 是否存在...")

        try:
            conn = psycopg2.connect(
                host=self.host,
                port=self.port,
                database='postgres',
                user=self.user,
                password=self.password,
                client_encoding='UTF8',
                connect_timeout=5
            )
            cursor = conn.cursor()

            # 查询数据库列表
            cursor.execute("SELECT datname FROM pg_database WHERE datname = %s", (self.database,))
            result = cursor.fetchone()

            cursor.close()
            conn.close()

            if result:
                print(f"  [OK] 数据库 '{self.database}' 已存在")
                return True
            else:
                print(f"  [ERROR] 数据库 '{self.database}' 不存在")
                self.issues.append(f"目标数据库 '{self.database}' 不存在")
                return False

        except psycopg2.OperationalError as e:
            print(f"  [ERROR] 无法检查数据库: {e}")
            return None

        except Exception as e:
            print(f"  [WARN] 数据库检查失败: {e}")
            return None

    def check_credentials(self):
        """验证用户凭据"""
        print(f"\n[5/5] 验证用户凭据...")

        try:
            conn = psycopg2.connect(
                host=self.host,
                port=self.port,
                database='postgres',
                user=self.user,
                password=self.password,
                client_encoding='UTF8',
                connect_timeout=5
            )
            cursor = conn.cursor()

            # 查询当前用户
            cursor.execute("SELECT current_user;")
            current_user = cursor.fetchone()[0]

            cursor.close()
            conn.close()

            print(f"  [OK] 用户凭据有效 (当前用户: {current_user})")
            return True

        except psycopg2.OperationalError as e:
            error_msg = str(e)
            if "password authentication failed" in error_msg:
                print("  [ERROR] 密码错误")
                self.issues.append("PostgreSQL 密码错误")
            else:
                print(f"  [ERROR] 凭据验证失败: {error_msg}")
            return False

        except Exception as e:
            print(f"  [WARN] 凭据验证失败: {e}")
            return None

    def run_full_diagnosis(self):
        """运行完整诊断"""
        print("=" * 60)
        print("PostgreSQL 数据库连接诊断")
        print("=" * 60)
        print(f"\n配置参数:")
        print(f"  主机: {self.host}")
        print(f"  端口: {self.port}")
        print(f"  数据库: {self.database}")
        print(f"  用户: {self.user}")

        results = {}

        # 执行所有检查
        results['service'] = self.check_service_status()
        results['port'] = self.check_port_listening()
        results['server'] = self.check_server_connection()

        # 只有连接成功才能进行后续检查
        if results['server']:
            results['database'] = self.check_database_exists()
            results['credentials'] = self.check_credentials()
        else:
            results['database'] = None
            results['credentials'] = None

        # 输出诊断结果
        print("\n" + "=" * 60)
        print("诊断结果摘要")
        print("=" * 60)

        if not self.issues and all(r for r in results.values() if r is not None):
            print("\n[OK] 所有检查通过！数据库连接正常。")
            return True, "OK"
        else:
            print("\n发现问题:")
            for i, issue in enumerate(self.issues, 1):
                print(f"  {i}. {issue}")

            if self.warnings:
                print("\n警告:")
                for i, warning in enumerate(self.warnings, 1):
                    print(f"  {i}. {warning}")

            # 生成修复建议
            print("\n" + "=" * 60)
            print("修复建议")
            print("=" * 60)

            if not results['service']:
                print("\n1. 启动 PostgreSQL 服务:")
                print("   以管理员身份运行: net start postgresql-x64-17")
                print("   或通过服务管理器启动")

            if not results['port']:
                print("\n2. 检查端口配置:")
                print("   确认 PostgreSQL 配置文件中的 port 设置")
                print("   检查防火墙是否阻止了端口连接")

            if results['server'] and not results['database']:
                print("\n3. 创建数据库:")
                print("   运行: python scripts/fix_db_connection.py")

            if not results['credentials']:
                print("\n4. 验证凭据:")
                print("   检查 .env 文件中的 DATABASE_URL 配置")
                print("   确认 PostgreSQL 用户名和密码正确")

            # 提供切换到 SQLite 的选项
            print("\n" + "=" * 60)
            print("备选方案")
            print("=" * 60)
            print("\n如果 PostgreSQL 配置太复杂，可以切换到 SQLite:")
            print("   运行: python scripts/switch_to_sqlite.py")

            return False, self.issues[0] if self.issues else "Unknown"


def main():
    """主函数"""
    diagnostic = DatabaseDiagnostic()
    success, error = diagnostic.run_full_diagnosis()

    # 返回状态码
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
