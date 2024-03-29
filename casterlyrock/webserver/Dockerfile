FROM ubuntu:16.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y software-properties-common vim
RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update

RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN apt-get install -y git

# update pip
RUN python3.6 -m pip install pip --upgrade
RUN python3.6 -m pip install wheel

# install node
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -y nodejs

# install docker
RUN apt-get install -y curl
RUN curl -sSL https://get.docker.com/ | sh

COPY requirement.txt requirement.txt
RUN pip3.6 install -r requirement.txt

COPY package.json /app/package.json
RUN cd /app && npm install

COPY app /app

WORKDIR /app

ENV FLASK_APP=flaskr
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

RUN npm run build

CMD python3.6 -m flask run -h 0.0.0.0 -p 3000
