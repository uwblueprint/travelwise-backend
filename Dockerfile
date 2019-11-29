FROM node:12

# Copy source files.
WORKDIR /app
COPY . .

# Install dependencies.
RUN yarn install

CMD ["node", "./bin/www"]
