#FROM ubuntu:16.04
#FROM tensorflow/tensorflow:latest-gpu
FROM wuyuehao/tensorflow:mychange

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

COPY requirement.txt requirement.txt
RUN pip3.6 install -r requirement.txt

COPY scripts /scripts

WORKDIR /scripts

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

CMD ["python3.6","-u","tf_job.py"]
