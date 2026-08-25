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

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /workspace/tpi-demo-shell/node_modules ./node_modules
COPY --from=build /workspace/tpi-demo-shell/dist/tpi-demo-shell/browser ./browser
COPY --from=build /workspace/tpi-demo-shell/dist/tpi-demo-shell/server ./server
EXPOSE 4000
CMD ["node", "server/server.mjs"]
