#!/bin/bash

# Use pgrep and pkill to find and kill processes matching your Node.js application
#pattern="npm run start"
pattern="node index.js"

# Find processes with the full command line
pids=$(pgrep -f "$pattern")

# Kill the processes and their child processes
for pid in $pids
do
    echo "Killing process with PID $pid and its children"
    pkill -P $pid
    kill $pid
done

echo "All processes have been terminated."
