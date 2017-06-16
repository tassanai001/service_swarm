FROM mysql:5.6
MAINTAINER BIG ART
EXPOSE 3306

RUN echo "Asia/Bangkok" > /etc/timezone
RUN echo "Asia/Bangkok" > /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata

ENV MYSQL_ROOT_PASSWORD tbdtest

ENV DATA /data
RUN mkdir -p $DATA
ADD $DATA/. ./var/lib/mysql
WORKDIR $DATA