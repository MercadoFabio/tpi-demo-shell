FROM node:22-alpine AS build

WORKDIR /workspace
COPY tpi-ui-kit ./tpi-ui-kit
COPY tpi-demo-usuarios-main/projects/usuarios-lib ./tpi-demo-usuarios-main/projects/usuarios-lib
COPY tpi-demo-productos-main/projects/productos-lib ./tpi-demo-productos-main/projects/productos-lib
COPY tpi-demo-shell-main ./tpi-demo-shell-main
WORKDIR /workspace/tpi-demo-shell-main
RUN npm ci
RUN npm run build -- --configuration production

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /workspace/tpi-demo-shell-main/node_modules ./node_modules
COPY --from=build /workspace/tpi-demo-shell-main/dist/tpi-demo-shell/browser ./browser
COPY --from=build /workspace/tpi-demo-shell-main/dist/tpi-demo-shell/server ./server
EXPOSE 4000
CMD ["node", "server/server.mjs"]
