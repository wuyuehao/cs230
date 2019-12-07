import pymongo
from pymongo import MongoClient
import pprint
import time
import subprocess
import time
from datetime import datetime
from bson.objectid import ObjectId
import os

time.sleep(15)

starttime=time.time()
client = MongoClient('mongodb://mongodb:27017/')
print("connected db")

db = client.myDatabase
myjobs = db.jobqueue

master_host_ip = os.environ.get('EXTERNAL_IP', '')
print("current host ip address: " + master_host_ip)

# check if there is object whose "job_status" = "submitted", then print it and trigger mclassifier
print("list all jobs in DB")
for x in myjobs.find():
  print(x)

def start_new_training(submitted_job_id, host_name, gpu_index):
  timestr = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
  container_name = "worker_" + timestr
  myjobs.update_one({'_id': submitted_job_id}, {"$set": {"container_name": container_name}})
  gpu_index_env = "GPU_INDEX=" + gpu_index
  host_name_env = "HOST_NAME=" + host_name
  master_host_ip_env = "EXTERNAL_IP=" + master_host_ip
  host_name_str = "ssh://user@" + host_name
  my_env = os.environ.copy()
  my_env["NV_GPU"] = gpu_index

  current_job =  myjobs.find_one({'_id': submitted_job_id})
  subprocess.Popen(["nvidia-docker", "-H", host_name_str, "run", "--name", container_name , "--rm", "-e", master_host_ip_env, "-e", gpu_index_env, "-e", host_name_env, "-v", "~/.ssh:/root/.ssh", "-v", "/var/run/docker.sock:/var/run/docker.sock", "-v", "/casterlyrock:/casterlyrock", "--network=casterlyrock_default","tf_job"], env=my_env)
# update single document every 60 seconds

host_dict = {master_host_ip: 4}

while True:
  print('checking submitted jobs for each gpu')
  for host_name, gpu_core in host_dict.items():
    for index in range(0, gpu_core):
      submitted_job = None
      while True:
        submitted_job = myjobs.find_one({'job_status': 'submitted'})
        if submitted_job is not None:
          break
      gpu_index = str(index)
      running_job = myjobs.find_one({"$and":[{'gpu_index': gpu_index}, {'job_status': 'running'}, {'host_name' : host_name}]})
      if running_job is None:
        print("update job " + str(submitted_job['_id']) + " to running on host " + host_name + " and gpu " + gpu_index)
        myjobs.update_one({'_id': submitted_job['_id']}, {"$set": {'job_status': 'running', 'gpu_index' : gpu_index, 'host_name' : host_name}})
        print("job started on host " + host_name + " and gpu " + gpu_index)
        start_new_training(submitted_job['_id'], host_name, gpu_index)
      else:
        print("There is other running job on host " + host_name + " and gpu: " + gpu_index)
  print("sleep 1 seconds for next check")
  time.sleep(1)
