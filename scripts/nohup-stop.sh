#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="$APP_DIR/.pids"

stop_pid_file() {
  local name="$1"
  local pidfile="$PID_DIR/$2"
  if [[ -f "$pidfile" ]]; then
    local pid
    pid="$(cat "$pidfile" || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "Stopping $name (pid=$pid)"
      kill "$pid" || true
      sleep 0.5
      if kill -0 "$pid" 2>/dev/null; then
        echo "$name still running, forcing kill -9"
        kill -9 "$pid" || true
      fi
    else
      echo "$name not running (stale pidfile)"
    fi
    rm -f "$pidfile"
  else
    echo "No pidfile for $name"
  fi
}

mkdir -p "$PID_DIR"
stop_pid_file "frontend" "frontend.pid"
stop_pid_file "backend" "backend.pid"

echo "Stopped."
