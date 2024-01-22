#!/bin/bash

# Total number of physical CPUs
totalCPUs=$(nproc)

# Directory to store log files
logDir="logs"
mkdir -p "$logDir"  # Create the directory if it doesn't exist

# Launch 8 instances of the Node.js/Express app
for i in {0..7}
do
    # Calculate CPU to use for this instance
    cpu=$((i % totalCPUs))

    # Set CPU affinity, start the app, and redirect output to log file
    taskset -c $cpu bash -c "PORT=$((3000 + $i)) npm run start > \"$logDir/app_instance_$i.log\" 2>&1 &"
    echo "App instance $i started on port $((3000 + $i)), assigned to CPU $cpu, and logging to $logDir/app_instance_$i.log"
done

echo "All app instances are up and running."
