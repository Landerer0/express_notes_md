# 📒 Markdown Note Taking App (Backend)

Proyecto basado en el roadmap [roadmap.sh/projects/markdown-note-taking-app](https://roadmap.sh/projects/markdown-note-taking-app), implementado con **Express.js**, **TypeScript** y **ESLint**, y documentada con Swagger.

Este backend provee un API REST para gestionar notas en formato Markdown. Cada nota se encuentra asociada a un usuario, el cual se debe registrar e iniciar sesión para poder acceder a sus notas. La autenticación utiliza JWT, los cuales se almacenan en cookies.

---

## 🚀 Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/) (con configuración recomendada para TS)
- [http-status-codes](https://www.npmjs.com/package/http-status-codes)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)
- [yamljs](https://www.npmjs.com/package/yamljs)

---


## 📄 Documentación Swagger

Este proyecto incluye documentación Swagger para explorar y probar los endpoints de forma interactiva.

1. La documentación se encuentra en el archivo `src/swagger/swagger.yaml`, siguiendo el estándar OpenAPI 3.0.  
2. Al iniciar el servidor, Swagger UI estará disponible en la ruta `GET /api-docs`, por defecto en http://localhost:3000/api-docs

## 🛠️ Instalación y uso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/express_notes_md.git
   cd express_notes_md
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Generar base de datos usando Prisma
   ```bash
   npx prisma generate
   ```

4. Iniciar servidor:
   ```bash
   npm run dev
   ```
