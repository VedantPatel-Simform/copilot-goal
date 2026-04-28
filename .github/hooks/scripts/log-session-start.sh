#!/bin/bash
# Log agent session start

INPUT=$(cat)
TIMESTAMP=$(date -u "+%Y-%m-%dT%H:%M:%S.000Z")
mkdir -p agent_logs

# Log to a plain text log file (session.log)
LOG_FILE="agent_logs/session.log"

if [[ "$INPUT" =~ ^\{ ]]; then
    SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
    USER=$(echo "$INPUT" | jq -r '.user // "Unknown User"')
    SOURCE=$(echo "$INPUT" | jq -r '.source // empty')
    echo "$TIMESTAMP | session_id: $SESSION_ID | user: $USER | source: $SOURCE" >> "$LOG_FILE"
else
    echo "$TIMESTAMP | session_id:  | user: Unknown User | source: " >> "$LOG_FILE"
fi
exit 0
