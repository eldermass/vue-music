#!/bin/bash
  
LOG_PATH=~/deploy_logs.txt;
FLAG=deploying;
date >> $LOG_PATH;
echo "开始重新部署\n" >> $LOG_PATH;

if [ ! -e $FLAG ]
then
        touch $FLAG;
        echo "拉取最新music镜像";
        docker pull asd285653184/music;

        #echo "停止容器";
        #CONTAINERS=`docker ps -a -q`;
        #docker stop $CONTAINERS;

        #echo "清空容器";
        #docker rm $CONTAINERS;

        #echo "清除docker镜像";
        #docker rmi `docker images -a -q`;

        echo "重新部署项目";
        cd ~/project/music;

        git pull;
        docker-compose up -d;

        echo "清空悬空镜像或者容器";

        docker image prune -a -f;
        docker container prune -f;

        cd ~;
        rm $FLAG;
        echo "部署成功\n" >> $LOG_PATH;
else
        echo "正在重新部署中......";
        echo "已在重新部署中......\n停止部署\n" >> $LOG_PATH;
fi
