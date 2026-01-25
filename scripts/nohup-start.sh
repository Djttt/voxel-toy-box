#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$APP_DIR/logs"
PID_DIR="$APP_DIR/.pids"

FRONT_PORT="${FRONT_PORT:-3001}"
BACK_PORT="${BACK_PORT:-5001}"

mkdir -p "$LOG_DIR" "$PID_DIR"

cd "$APP_DIR"

echo "[1/3] Starting backend (Flask-SocketIO) on :$BACK_PORT"
if [[ -f "$PID_DIR/backend.pid" ]] && kill -0 "$(cat "$PID_DIR/backend.pid")" 2>/dev/null; then
  echo "Backend already running (pid=$(cat "$PID_DIR/backend.pid"))"
else
  # Prefer venv if present
  if [[ -x "$APP_DIR/venv/bin/python" ]]; then
    PY="$APP_DIR/venv/bin/python"
  else
    PY="python3"
  fi

  nohup "$PY" "$APP_DIR/server/app.py" >"$LOG_DIR/backend.log" 2>&1 &
  echo $! > "$PID_DIR/backend.pid"
  echo "Backend pid=$(cat "$PID_DIR/backend.pid")"
fi

echo "[2/3] Building frontend"
nohup bash -lc "cd '$APP_DIR' && npm run build" >"$LOG_DIR/frontend-build.log" 2>&1

echo "[3/3] Starting frontend preview on :$FRONT_PORT"
if [[ -f "$PID_DIR/frontend.pid" ]] && kill -0 "$(cat "$PID_DIR/frontend.pid")" 2>/dev/null; then
  echo "Frontend already running (pid=$(cat "$PID_DIR/frontend.pid"))"
else
  nohup npm run preview -- --host 0.0.0.0 --port "$FRONT_PORT" >"$LOG_DIR/frontend.log" 2>&1 &
  echo $! > "$PID_DIR/frontend.pid"
  echo "Frontend pid=$(cat "$PID_DIR/frontend.pid")"
fi

echo "Done. Logs: $LOG_DIR"
