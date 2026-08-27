FROM node:22-alpine AS build

WORKDIR /workspace
COPY tpi-ui-kit ./tpi-ui-kit
COPY tpi-demo-usuarios/projects/usuarios-lib ./tpi-demo-usuarios/projects/usuarios-lib
COPY tpi-demo-productos/projects/productos-lib ./tpi-demo-productos/projects/productos-lib
COPY tpi-demo-shell ./tpi-demo-shell
WORKDIR /workspace/tpi-demo-shell
RUN npm ci
RUN ln -s /workspace/tpi-demo-shell/node_modules /workspace/node_modules
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine AS runtime

COPY tpi-demo-shell/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/tpi-demo-shell/dist/tpi-demo-shell/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
