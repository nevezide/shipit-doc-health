##
# NAME             : iadvize/it-crm-base-api-service
# VERSION          : latest
# DOCKER-VERSION   : 1.9
# DESCRIPTION      : Api Service for Base CRM
# TO_BUILD         : docker build -t khaly/shipit-bot:master .
# TO_BUILD_DEV     : docker build -t khaly/shipit-bot:latest .
# TO_RUN           : docker run --rm --env-file .env -p 8080:8080 shipit-bot
##

FROM iadvize/nodejs:6

MAINTAINER Gaëlle Acas <gaelle.acas@iadvize.com>

ARG CIRCLE_REPOSITORY_URL
ARG CIRCLE_BUILD_URL
ARG CIRCLE_PROJECT_REPONAME
ARG CIRCLE_BRANCH
ARG CIRCLE_TAG
ARG CIRCLE_SHA1
ARG CIRCLE_BUILD_NUM
ARG CI_PULL_REQUEST
ARG CIRCLE_USERNAME

LABEL com.github.repository.url=${CIRCLE_REPOSITORY_URL} \
      com.github.repository.name=${CIRCLE_PROJECT_REPONAME} \
      com.github.repository.branch=${CIRCLE_BRANCH} \
      com.github.repository.tag=${CIRCLE_TAG} \
      com.github.repository.tag=${CIRCLE_SHA1} \
      com.github.pull-request.url=${CI_PULL_REQUEST} \
      com.circleci.build.url=${CIRCLE_BUILD_URL} \
      com.circleci.build.number=${CIRCLE_BUILD_NUM} \
      com.iadvize.author=${CIRCLE_USERNAME}

RUN apt-get update -qq && \
 apt-get clean -yq && \
 apt-get install jq && \
 rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

EXPOSE 3000 3001

CMD ["node", "index.js"]