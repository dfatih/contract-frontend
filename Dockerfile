FROM maven.kriegerit.de:18444/krieger/infrastructure/docker-images/javascript/nginx

RUN rm -rf /usr/share/nginx/html/*

ARG ARTIFACT
ADD ${ARTIFACT} /usr/share/nginx/html
