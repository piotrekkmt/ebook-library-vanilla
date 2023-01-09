FROM node:16-alpine
WORKDIR /app
# Copy and download dependencies
COPY package.json ./
RUN yarn

# Copy the source files into the image
COPY . .

EXPOSE 4000

CMD yarn start
