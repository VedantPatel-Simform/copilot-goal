#!/bin/bash

# 1. Capture the JSON payload from Copilot
INPUT=$(cat)

# 2. Extract tool name and the specific command string
# The tool name might be 'bash', 'runTerminalCommand', or 'edit'
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName // .tool_name')
# Extracts command from toolArgs (which is often a nested string)
COMMAND=$(echo "$INPUT" | jq -r '.toolArgs' | jq -r '.command // empty')

# 3. Define the "Blacklist" Regex
# LINUX: rm -rf, mkfs, dd, shred, chmod 777, chown
# GIT: push --force, reset --hard, branch -D, remote add (security risk)
# DATABASE: DROP, DELETE, TRUNCATE, ALTER, UPDATE, INSERT, GRANT
DANGER_ZONE="(rm\s+-rf|rm\s+--recursive|mkfs|dd\s+if|shred|chmod\s+777|push\s+--force|push\s+-f|reset\s+--hard|branch\s+-D|remote\s+add|DROP\s+TABLE|DROP\s+DATABASE|DELETE\s+FROM|TRUNCATE\s+TABLE|ALTER\s+TABLE|UPDATE\s+.*\s+SET|INSERT\s+INTO|GRANT\s+ALL)"

# 4. Logic: Block if dangerous pattern is found in terminal commands
if [[ "$TOOL_NAME" == "bash" || "$TOOL_NAME" == "runTerminalCommand" ]]; then
    if echo "$COMMAND" | grep -qEi "$DANGER_ZONE"; then
        # FAIL: Return the JSON structure Copilot expects to block execution
        echo "{
          \"hookSpecificOutput\": {
            \"permissionDecision\": \"deny\",
            \"permissionDecisionReason\": \"Blocked by Security Hook: The command '$COMMAND' contains restricted operations (Linux/Git/DB).\"
          }
        }"
        exit 0
    fi
fi

# 5. PASS: Allow everything else
echo "{\"permissionDecision\": \"allow\"}"
exit 0