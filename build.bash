#!/bin/bash
set -e

declare -a builds
builds=(
    build-server
    build-home
    build-shop
    build-create-product
    build-test
    build-test-api
)

for (( i = 0; i < ${#builds[*]}; i++ ))
do
    npm run ${builds[i]}
done