FROM nginx:latest
COPY . /etc/nginx/

# # ssl init
# RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/dhparam.pem -out /etc/nginx/dhparam.pem -subj "/C=US/ST=California/L=San Francisco/O=nginxconfig.io/CN=*.nginxconfig.io"


# # Start the nginx server
# CMD ["nginx", "-g", "daemon off;"]
