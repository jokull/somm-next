#!/bin/bash

# Start a new tmux session and create the first window (tab)
tmux new-session -d -s somm -n next 'pnpm run dev'

# Set mouse support and increase scrollback buffer for this session
tmux set -t somm mouse on
tmux set -t somm history-limit 10000

# Create additional windows (tabs) for other commands
tmux new-window -t somm -n tunnel 'cloudflared tunnel --config ~/.cloudflared/members.yaml run --protocol http2'

# Customize the status bar for this session
tmux set -t somm status-right ''

# Bind keys to toggle mouse mode
tmux bind-key M set-option -g mouse on \; display-message "Mouse on"
tmux bind-key m set-option -g mouse off \; display-message "Mouse off"

# Select the 'next' tab as default
tmux select-window -t somm:next

# Attach to the tmux session
tmux attach-session -t somm
