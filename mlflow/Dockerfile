FROM python:3.6.0

RUN mkdir /mlflow/

RUN pip install mlflow==1.0.0

EXPOSE 5000

CMD mlflow server \
    --host 0.0.0.0
