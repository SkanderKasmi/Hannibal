#!/usr/bin/env bash
# /opt/Hannibal/agent/agent.sh
# Modes:
#  - install   : prepare environment
#  - run       : run forever, listen for tasks (e.g. from RabbitMQ/Kafka)
#  - heartbeat : simple health ping

MODE="$1"

case "$MODE" in
  install)
    echo "[agent] installing dependencies..."

    exit 0
    ;;
  heartbeat)
    echo "[agent] heartbeat $(date)"
    exit 0
    ;;
  run|*)
    echo "[agent] starting main loop..."
    while true; do
      # TODO:
      # - read tasks from automation service (queue, http, etc.)
      # - execute pipeline/ansible/terraform
      # - write logs (Hannibal's log.sh will ship them)
      sleep 5
    done
    ;;
esac
