"""
Entry point for the FastAPI application.
This file should be at the root of the backend directory.
"""

from app.app import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)