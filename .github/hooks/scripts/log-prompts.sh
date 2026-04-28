#!/bin/bash

# 1. Read the JSON payload from Copilot
INPUT=$(cat)

# 2. Extract the prompt and timestamp using jq
# Note: We use .timestamp and .prompt based on your specific JSON
PROMPT_TEXT=$(echo "$INPUT" | jq -r '.prompt // "No Prompt Found"')
RAW_TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp // empty')

# 3. Handle the Timestamp
# Since your timestamp is already a readable string (2026-04-28...), 
# we can use it directly or clean it up.
if [[ -n "$RAW_TIMESTAMP" ]]; then
    # This cleans "2026-04-28T11:42:40.455Z" into "2026-04-28 11:42:40"
    HUMAN_DATE=$(echo "$RAW_TIMESTAMP" | sed 's/T/ /; s/\..*//')
else
    HUMAN_DATE=$(date "+%Y-%m-%d %H:%M:%S")
fi

# 4. Append to the log file
mkdir -p agent_logs
echo "[$HUMAN_DATE] PROMPT: $PROMPT_TEXT" >> agent_logs/prompts.log

exit 0