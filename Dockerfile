#pull official docker image for ReactJS
FROM node:12.17.0-alpine3.11 as BUILD

#set working directory
WORKDIR /webapp

#copy and run app
COPY . ./

RUN npm run heroku-postbuild
FROM BUILD as RUN
CMD npm run start
