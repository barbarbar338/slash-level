FROM node:19.1.0-alpine3.16

RUN apk update && apk add --no-cache gcompat

EXPOSE 8080

WORKDIR /app

COPY . .

CMD ["yarn", "start"]