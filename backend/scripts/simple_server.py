#!/usr/bin/env python3
"""
Simple test server to verify the port configuration works
"""

from fastapi import FastAPI
import uvicorn
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="Test Server", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Server is running on port 8989", "status": "success"}

@app.get("/health")
async def health():
    return {"status": "healthy", "port": 8989}

if __name__ == "__main__":
    print(f"Starting server on port 8989...")
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8989,
        reload=False,
        workers=1
    )