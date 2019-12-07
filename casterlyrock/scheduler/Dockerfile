#FROM ubuntu:16.04
FROM wuyuehao/tensorflow:mychange
#FROM nvidia/cuda

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y software-properties-common vim
RUN add-apt-repository -y ppa:jonathonf/python-3.6
RUN apt-get update

RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN apt-get install -y git

# update pip
RUN python3.6 -m pip install pip --upgrade
RUN python3.6 -m pip install wheel

# install docker
RUN apt-get install -y curl
RUN curl -sSL https://get.docker.com/ | sh

# install nvidia-docker
RUN curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add - && \
    distribution=$(. /etc/os-release;echo $ID$VERSION_ID) && \
    curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list && \
    apt-get update

RUN apt-get install -y nvidia-docker2 

COPY requirement.txt requirement.txt 
RUN pip3.6 install -r requirement.txt

COPY scripts /scripts

WORKDIR /scripts

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

CMD ["python3.6","-u","scheduler.py"]
