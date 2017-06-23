#!/usr/bin/env bash
docker service rm localservicedb1
docker service create -e SWRM=TRUE -e POOL_MODE=POOLNODE -e MONGODB=172.20.10.72 -e REDIS=172.20.10.67 -e ELASTIC=172.20.10.67 -e ELASTIC_MANAGER=172.20.10.67 -e MODE=PRODUCTION --name localservicedb1 -p 3003:3003 --replicas 5 --with-registry-auth itopplus/localservice:test.poc.the.art