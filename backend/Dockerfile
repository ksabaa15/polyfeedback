FROM node:16.16-alpine3.15
RUN addgroup app && adduser -G app -D app
RUN mkdir /app && chown app  /app
USER app
WORKDIR /app
COPY package*.json ./
RUN ["npm", "ci"]
COPY ./ ./
EXPOSE 3000
CMD ["npm", "start"]