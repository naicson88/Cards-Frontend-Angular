FROM node:12.16.1-alpine as builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm i && npm run build --prod

FROM nginx:1.15.8-alpine
WORKDIR /usr/share/nginx/html
# Copy static assets from builder stage
COPY --from=builder /app/dist/yugioh-front . 
