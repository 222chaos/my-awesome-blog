import sys
import os
# 添加backend目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8989,
        reload=False,  # Disable reload to avoid multiprocessing issues on Windows
        workers=1      # Use single worker
    )