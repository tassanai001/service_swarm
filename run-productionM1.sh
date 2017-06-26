#!/usr/bin/env bash
docker rm -f serviceswarm_nginx_1 serviceswarm_express_1 serviceswarm_mysql_1
docker rmi -f tassanai/serviceswarm_nginx tassanai/serviceswarm_express tassanai/serviceswarm_mysql
docker pull tassanai/serviceswarm_nginx
docker pull tassanai/serviceswarm_express
docker pull tassanai/serviceswarm_mysql
docker service rm localservicedb1
docker service create -e MACHINE_NAME=MASTER1 -e SWRM=TRUE -e POOL_MODE=POOLNODE -e MONGODB=172.20.10.72 -e REDIS=172.20.10.67 -e ELASTIC=172.20.10.67 -e ELASTIC_MANAGER=172.20.10.67 -e MODE=PRODUCTION --name localservicedb1 -p 3003:3003 --replicas 5 --with-registry-auth itopplus/localservice:test.poc.the.art
docker stack deploy --compose-file docker-compose-master1.yml web_stack