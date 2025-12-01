#!/usr/bin/env bash
#
# Hannibal Kafka producer
# - Collects system stats (CPU, RAM, disk, OS, etc.)
# - Runs connectivity.sh and log.sh and tasks.sh
# - Sends metrics + logs to Kafka
# - Watches for agent.sh and installs/runs it when available

set -euo pipefail

HANNIBAL_DIR="${HANNIBAL_DIR:-/opt/Hannibal}"
LOG_DIR="${HANNIBAL_DIR}/logs"
AGENT_DIR="${HANNIBAL_DIR}/agent"
mkdir -p "$LOG_DIR" "$AGENT_DIR"

# ---- CONFIG VIA ENV ----
KAFKA_BROKER="${KAFKA_BROKER:-localhost:9092}"
KAFKA_METRICS_TOPIC="${KAFKA_METRICS_TOPIC:-hannibal.metrics}"
KAFKA_LOGS_TOPIC="${KAFKA_LOGS_TOPIC:-hannibal.logs}"

# Optional identifiers injected by infra / agent services
HANNIBAL_VM_ID="${HANNIBAL_VM_ID:-$(hostname)}"
HANNIBAL_RG_ID="${HANNIBAL_RG_ID:-unknown-rg}"
HANNIBAL_AGENT_ID="${HANNIBAL_AGENT_ID:-agent-unknown}"

# Loop interval in seconds
HANNIBAL_INTERVAL="${HANNIBAL_INTERVAL:-10}"

METRICS_LOG="${LOG_DIR}/metrics.log"
APP_LOG="${LOG_DIR}/hannibal.log"
CONNECTIVITY_LOG="${LOG_DIR}/connectivity.log"
TASKS_LOG="${LOG_DIR}/tasks.log"

AGENT_SCRIPT="${AGENT_DIR}/agent.sh"
AGENT_INSTALLED_FLAG="${AGENT_DIR}/.installed"

# ------------- HELPERS -------------

log() {
  local level="$1"; shift
  local msg="$*"
  local ts
  ts="$(date --iso-8601=seconds 2>/dev/null || date)"
  echo "[$ts] [$level] $msg" | tee -a "$APP_LOG"
}

# Generic function to send one JSON line to Kafka topic
send_to_kafka() {
  local topic="$1"
  local payload="$2"

  if command -v kcat >/dev/null 2>&1; then
    printf '%s\n' "$payload" | kcat -b "$KAFKA_BROKER" -t "$topic" || \
      log "ERROR" "kcat send failed to topic=$topic"
  elif command -v kafkacat >/dev/null 2>&1; then
    printf '%s\n' "$payload" | kafkacat -b "$KAFKA_BROKER" -t "$topic" || \
      log "ERROR" "kafkacat send failed to topic=$topic"
  elif command -v kafka-console-producer >/dev/null 2>&1; then
    printf '%s\n' "$payload" | kafka-console-producer --broker-list "$KAFKA_BROKER" --topic "$topic" >/dev/null 2>&1 || \
      log "ERROR" "kafka-console-producer send failed to topic=$topic"
  else
    log "WARN" "No Kafka client (kcat/kafkacat/kafka-console-producer) found, cannot send to Kafka"
  fi
}

# Collect system stats and return JSON string
collect_system_stats() {
  local os_name kernel cpu_load mem_total mem_free mem_used disk_usage uptime_sec

  os_name="$(uname -s 2>/dev/null || echo "unknown")"
  kernel="$(uname -r 2>/dev/null || echo "unknown")"

  # Load average (1 minute)
  cpu_load="$(awk '{print $1}' /proc/loadavg 2>/dev/null || echo "0")"

  mem_total="$(grep -i MemTotal /proc/meminfo 2>/dev/null | awk '{print $2}')"
  mem_free="$(grep -i MemFree /proc/meminfo 2>/dev/null | awk '{print $2}')"
  mem_used=$(( (mem_total - mem_free) 2>/dev/null || 0 ))

  disk_usage="$(df -h / 2>/dev/null | awk 'NR==2{print $5}' | tr -d '%' )"
  uptime_sec="$(awk '{print int($1)}' /proc/uptime 2>/dev/null || echo "0")"

  cat <<EOF
{
  "vmId": "$HANNIBAL_VM_ID",
  "resourceGroupId": "$HANNIBAL_RG_ID",
  "agentId": "$HANNIBAL_AGENT_ID",
  "timestamp": "$(date --iso-8601=seconds 2>/dev/null || date)",
  "os": "$os_name",
  "kernel": "$kernel",
  "cpuLoad1m": "$cpu_load",
  "memTotalKb": "$mem_total",
  "memFreeKb": "$mem_free",
  "memUsedKb": "$mem_used",
  "diskRootUsagePercent": "$disk_usage",
  "uptimeSeconds": "$uptime_sec"
}
EOF
}

# -------------- AGENT HANDLING --------------

maybe_install_agent() {
  if [[ -x "$AGENT_SCRIPT" && ! -f "$AGENT_INSTALLED_FLAG" ]]; then
    log "INFO" "Found agent.sh, running install..."
    if "$AGENT_SCRIPT" install >>"$APP_LOG" 2>&1; then
      touch "$AGENT_INSTALLED_FLAG"
      log "INFO" "Agent install completed."
    else
      log "ERROR" "Agent install failed."
    fi
  fi
}

maybe_heartbeat_agent() {
  if [[ -x "$AGENT_SCRIPT" && -f "$AGENT_INSTALLED_FLAG" ]]; then
    # Optional heartbeat or health-check to agent
    "$AGENT_SCRIPT" heartbeat >>"$APP_LOG" 2>&1 || \
      log "WARN" "Agent heartbeat failed."
  fi
}

# -------------- MAIN LOOP --------------

log "INFO" "Starting Hannibal kafkaproducer.sh"
log "INFO" "Using broker=$KAFKA_BROKER metricsTopic=$KAFKA_METRICS_TOPIC logsTopic=$KAFKA_LOGS_TOPIC"

while true; do
  # 1) Run connectivity check
  if [[ -x "${HANNIBAL_DIR}/connectivity.sh" ]]; then
    "${HANNIBAL_DIR}/connectivity.sh" >>"$CONNECTIVITY_LOG" 2>&1 || \
      log "WARN" "connectivity.sh returned non-zero exit code"
  fi

  # 2) Run tasks (user-defined actions)
  if [[ -x "${HANNIBAL_DIR}/tasks.sh" ]]; then
    "${HANNIBAL_DIR}/tasks.sh" >>"$TASKS_LOG" 2>&1 || \
      log "WARN" "tasks.sh returned non-zero exit code"
  fi

  # 3) Run log.sh to generate application logs
  if [[ -x "${HANNIBAL_DIR}/log.sh" ]]; then
    "${HANNIBAL_DIR}/log.sh" >>"$APP_LOG" 2>&1 || \
      log "WARN" "log.sh returned non-zero exit code"
  fi

  # 4) Collect metrics and send to Kafka
  metrics_json="$(collect_system_stats)"
  echo "$metrics_json" >>"$METRICS_LOG"
  send_to_kafka "$KAFKA_METRICS_TOPIC" "$metrics_json"

  # 5) Ship recent logs as log events
  #    (simple approach: send last 50 lines, may duplicate; monitorservice can deduplicate)
  if [[ -f "$APP_LOG" ]]; then
    tail -n 50 "$APP_LOG" | while read -r line; do
      log_json=$(cat <<EOF
{
  "vmId": "$HANNIBAL_VM_ID",
  "resourceGroupId": "$HANNIBAL_RG_ID",
  "agentId": "$HANNIBAL_AGENT_ID",
  "timestamp": "$(date --iso-8601=seconds 2>/dev/null || date)",
  "line": "$(echo "$line" | sed 's/"/\\"/g')"
}
EOF
)
      send_to_kafka "$KAFKA_LOGS_TOPIC" "$log_json"
    done
  fi

  # 6) Look for agent.sh and install/run it if requested
  maybe_install_agent
  maybe_heartbeat_agent

  sleep "$HANNIBAL_INTERVAL"
done
