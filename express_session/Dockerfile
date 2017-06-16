FROM itopplus/dashboard
MAINTAINER BIG ART
EXPOSE 3000

RUN echo "Asia/Bangkok" > /etc/timezone
RUN echo "Asia/Bangkok" > /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata

ENV INSTALL_PATH /project
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH
ADD $INSTALL_PATH/. .
RUN npm install

CMD ["node","./bin/index.js"]