#!/bin/bash

# Get the absolute path of the script directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Starting FocusFlow Task Manager..."

# Function to clean up background processes on exit
cleanup() {
    echo -e "\n🛑 Stopping all servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    exit 0
}

# Trap Ctrl+C (SIGINT) and exit (SIGTERM)
trap cleanup SIGINT SIGTERM

# 1. Start Backend
echo "📡 Launching FastAPI Backend on http://127.0.0.1:8000..."
cd "$PROJECT_DIR/backend" || exit 1
source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start Frontend
echo "💻 Launching Vite React Frontend on http://127.0.0.1:5173..."
cd "$PROJECT_DIR/frontend" || exit 1
npm run dev -- --host 127.0.0.1 &
FRONTEND_PID=$!

echo "✨ Both servers are now running."
echo "👉 View API docs: http://127.0.0.1:8000/docs"
echo "👉 View App UI:   http://127.0.0.1:5173"
echo "Press [Ctrl+C] to stop both servers."

# Keep the script running to wait for background processes
wait
