FROM ubuntu:22.04

RUN apt update && apt upgrade -y && apt install -y git make gcc g++ python3 python3-pip build-essential software-properties-common curl wget

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

RUN apt install -y nodejs

RUN npm install -g yarn

EXPOSE 8080

WORKDIR /app

COPY . .

CMD ["yarn", "start"]
