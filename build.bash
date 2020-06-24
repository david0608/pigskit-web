#!/bin/bash
set -e

declare -a builds
builds=(
    build-server
    build-shop
    build-home
    build-shops
    build-test
)

for (( i = 0; i < ${#builds[*]}; i++ ))
do
    npm run ${builds[i]}
done