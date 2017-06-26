FROM nginx:1.13.0
MAINTAINER BIG ART
EXPOSE 8091

ENV INSTALL_PATH ./conf.d
RUN echo "Asia/Bangkok" > /etc/timezone
RUN echo "Asia/Bangkok" > /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata
RUN mkdir $OTHER_CONFIG /etc/nginx/sites-enabled

ADD $INSTALL_PATH /etc/nginx/conf.d
ADD ./nginx.conf /etc/nginx/nginx.conf