"""服务器启动类

用于管理和启动后端服务，提供灵活的配置选项
"""

import uvicorn
from app.main import app
from app.core.config import settings


class ServerStarter:
    """服务器启动器类
    
    提供多种启动选项和配置管理
    """
    
    def __init__(self, host: str = "127.0.0.1", port: int = 8989):
        """
        初始化服务器启动器
        
        Args:
            host: 服务器主机地址，默认为 "127.0.0.1"
            port: 服务器端口，默认为 8989
        """
        self.host = host
        self.port = port
        self.app = app

    def start(self, reload: bool = False, workers: int = 1):
        """
        启动服务器
        
        Args:
            reload: 是否启用热重载，默认为 False
            workers: 工作进程数，默认为 1
        """
        print(f"Starting {settings.APP_NAME} server on {self.host}:{self.port}")
        print(f"Access the API documentation at http://{self.host}:{self.port}/docs")
        
        uvicorn.run(
            self.app,
            host=self.host,
            port=self.port,
            reload=reload,
            workers=workers
        )

    def start_dev(self):
        """启动开发模式服务器（启用热重载）"""
        print(f"Starting {settings.APP_NAME} in development mode...")
        self.start(reload=True)

    def start_prod(self, workers: int = 4):
        """启动生产模式服务器"""
        print(f"Starting {settings.APP_NAME} in production mode...")
        self.start(reload=False, workers=workers)


if __name__ == "__main__":
    # 默认启动服务器
    starter = ServerStarter()
    starter.start()