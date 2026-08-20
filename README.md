# TPI Demo Shell

Aplicación contenedora del ejemplo de arquitectura **multirepo modular** para el TPI. Es responsable sólo del layout, navegación y enrutamiento. Consume las librerías de dominio desde GitHub Packages mediante lazy loading:

```ts
loadChildren: () =>
  import('@mercadofabio/usuarios-lib').then((module) => module.usuariosRoutes);
```

## Ecosistema

| Repositorio | Responsabilidad |
| --- | --- |
| [tpi-demo-shell](https://github.com/MercadoFabio/tpi-demo-shell) | Shell, autenticación central y router |
| [tpi-demo-usuarios](https://github.com/MercadoFabio/tpi-demo-usuarios) | Librería del dominio Usuarios |
| [tpi-demo-productos](https://github.com/MercadoFabio/tpi-demo-productos) | Librería del dominio Productos |

## Ejecutar

Luego de que las librerías estén publicadas, autenticarse en GitHub Packages y ejecutar:

```bash
npm install
npm start
```

El Shell y las librerías de dominio consultan el BFF Java compartido en
`http://localhost:8081/api`. Para levantarlo:

```bash
cd ..\..\ejemplo-tpi-backend\tpi-backend-gateway
docker compose up --build
```

El workflow `actualizar-shell.yml` recibe `repository_dispatch`, instala la última versión del paquete y conserva `package.json` y `package-lock.json`.

> Para que el evento entre repositorios funcione, configurar en este repositorio y en ambos repositorios de features un secret `SHELL_DISPATCH_TOKEN`: un PAT clásico con alcance `repo`. La demo conserva el nombre del secret explícito para que se pueda explicar el límite de permisos de `GITHUB_TOKEN`.
