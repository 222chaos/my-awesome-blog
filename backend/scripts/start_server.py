"""服务器启动脚本

提供命令行接口来启动服务器的不同模式
"""

import argparse
from start_server import ServerStarter


def main():
    parser = argparse.ArgumentParser(description="启动后端服务器")
    parser.add_argument(
        "--mode", 
        choices=["dev", "prod", "default"], 
        default="default",
        help="运行模式: dev(开发模式), prod(生产模式), default(默认模式)"
    )
    parser.add_argument(
        "--host",
        type=str,
        default="127.0.0.1",
        help="服务器主机地址 (默认: 127.0.0.1)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8989,
        help="服务器端口 (默认: 8989)"
    )

    args = parser.parse_args()

    starter = ServerStarter(host=args.host, port=args.port)

    if args.mode == "dev":
        starter.start_dev()
    elif args.mode == "prod":
        starter.start_prod()
    else:
        starter.start()


if __name__ == "__main__":
    main()