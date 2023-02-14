# FROM node:12.16.1-alpine as builder
# # Set working directory
# WORKDIR /app
# # Copy all files from current directory to working dir in image
# COPY . .
# # install node modules and build assets
# RUN npm i && npm run build --prod

# FROM nginx:1.15.8-alpine
# WORKDIR /usr/share/nginx/html
# # Copy static assets from builder stage
# COPY --from=builder /app/dist/yugioh-front . 
#CMD ["ng", "serve", "--host", "0.0.0.0"]

FROM node:16.19.0-alpine as builder
# # Set working directory
WORKDIR /app
COPY package.json /app
RUN npm install --force
# # Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
#RUN npm run build --prod 
RUN npm run build

FROM nginx:1.15.8-alpine
VOLUME /var/cache/nginx
COPY --from=builder app/dist/yugioh-front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

#COLOCADO PASTA DIST NO DOCKER IGNORE, AVALIAR SE NAO É O CASO DE REMOVER
#ng build (--prod or not) Não é preciso rodar! 
#docker build --t cards-angular .
#docker run -d --name cards-angular -p 4200:80 cards-angular // 80 é por causa do NGinx