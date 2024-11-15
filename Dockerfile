# Stage 1: deps
FROM node:18-alpine AS deps
RUN apk update && apk add --no-cache docker-cli
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install # --production
COPY . .
CMD ["npm", "run", "dev"]
