import sys
import os

# Ensure the project root is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
