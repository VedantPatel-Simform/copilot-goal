#!/bin/bash
# Log every tool execution to a JSON file

INPUT=$(cat)


# Extract minimal fields from the Copilot PreToolUse payload
TOOL_NAME=$(echo "$INPUT"     | jq -r '.tool_name          // "unknown"')
SESSION_ID=$(echo "$INPUT"    | jq -r '.session_id         // "unknown"')
HOOK_EVENT=$(echo "$INPUT"    | jq -r '.hook_event_name    // "unknown"')
ISO_TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp          // ""')
TOOL_USE_ID=$(echo "$INPUT"   | jq -r '.tool_use_id        // ""')
COMMAND=$(echo "$INPUT"       | jq -r '.tool_input.command // ""')

# Use the ISO timestamp from the payload; fall back to now if missing
if [[ -z "$ISO_TIMESTAMP" ]]; then
  ISO_TIMESTAMP=$(date -u "+%Y-%m-%dT%H:%M:%S.000Z")
fi

mkdir -p agent_logs

LOG_FILE="agent_logs/tool-use.log"
echo "$ISO_TIMESTAMP | hook_event: $HOOK_EVENT | session_id: $SESSION_ID | tool_name: $TOOL_NAME | tool_use_id: $TOOL_USE_ID | command: $COMMAND" >> "$LOG_FILE"
exit 0

exit 0
