#!/bin/bash
set -e

# Declare all modules that should be builded.
declare -a builds
builds=(
    build-server
    build-root
    build-home
    build-shop
    build-menu
)

# Build all modules.
for (( i = 0; i < ${#builds[*]}; i++ ))
do
    npm run ${builds[i]}
done