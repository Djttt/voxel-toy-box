#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="$APP_DIR/.pids"

status_one() {
  local name="$1"
  local pidfile="$PID_DIR/$2"
  if [[ -f "$pidfile" ]]; then
    local pid
    pid="$(cat "$pidfile" || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "$name: running (pid=$pid)"
    else
      echo "$name: not running (stale pidfile)"
    fi
  else
    echo "$name: not running"
  fi
}

status_one "backend" "backend.pid"
status_one "frontend" "frontend.pid"
