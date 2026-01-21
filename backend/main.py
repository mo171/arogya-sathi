"""
Vercel entry point for FastAPI application
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app.app import app
except ImportError as e:
    print(f"Import error: {e}")
    # Create a minimal app as fallback
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    def root():
        return {"error": "Import failed", "message": str(e)}

# This is what Vercel will use
handler = app