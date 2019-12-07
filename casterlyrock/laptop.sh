#!/bin/bash

export EXTERNAL_IP=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' )

docker stop $(docker ps | grep tf_job | awk '{print $1}') 2>/dev/null
set -e

mkdir -p /casterlyrock/tfhub
mkdir -p /casterlyrock/mongo_data
mkdir -p /casterlyrock/data

docker-compose -f docker-compose-cpu.yml down
docker-compose -f docker-compose-cpu.yml build
docker-compose -f docker-compose-cpu.yml up

