#!/bin/bash

sudo docker stop $(sudo docker ps | grep tf_job | awk '{print $1}') 2>/dev/null
#rm -rf /casterlyrock/mongo_data
docker-compose down
