#!/bin/bash
set -e

declare -a builds
builds=(
    build-server
    build-main
    build-menu
)

for (( i = 0; i < ${#builds[*]}; i++ ))
do
    npm run ${builds[i]}
done