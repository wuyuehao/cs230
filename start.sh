#!/bin/bash

export EXTERNAL_IP=$(hostname --ip | cut -d " " -f1)

sudo docker stop $(sudo docker ps | grep tf_job | awk '{print $1}') 2>/dev/null
set -e

#rm -rf /casterlyrock/mongo_data
mkdir -p /casterlyrock/tfhub
mkdir -p /casterlyrock/mongo_data
mkdir -p /casterlyrock/data
mkdir -p /casterlyrock/models/bert_bot_model/

docker-compose down
docker-compose build
docker build -t tf_job tf_job
docker-compose up
