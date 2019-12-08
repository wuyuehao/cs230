## About the project

This is the repository we created for cs230. It is organized in following structure.
- winterfell - the python code we used for model development in jupyter notebook.
- casterlyrock - a toolset we built for quick and scalable experimental runs. It allows us to choose base model, specify hyper parameters, submit the job to multiple GPU boxes, evaluate the result, generate report, compare between different excises and track all the jobs.
- kingslanding - our final project report.


## CasterlyRock Project

## Installation

check out from a GPU box, go into /webserver, run npm install.

### Clone

- Clone this repo to your local machine

### Prerequisite

1. /tmp/data is the folder to store dataset

2. On CORP network /tmp/tfhub is the folder to store bert model cache 

3. /tmp/mongo_data is the folder to store mongodb data

```
mkdir -p /tmp/mongo_data /tmp/tfhub /tmp/data
```

### Setup

#### Easy start
```
./start.sh
```

#### Step by Step Start

All operations under project (casterlyrock) folder
```
docker build -t tf_job tf_job
docker-comopse build

// start cluster
docker-compose up
```

### Restart

```
docker build -t tf_job tf_job
docker-compose build

// shutdown old cluster and start new one
docker-compose down && docker-compose up
```

---
## Reference
- MLFlow : https://mlflow.org/
- Ant Design : https://ant.design/
- Create React App : https://github.com/facebookincubator/create-react-app
- Flask : https://www.palletsprojects.com/p/flask/
- Bert : https://github.com/google-research/bert
