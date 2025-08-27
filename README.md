# 📒 Markdown Note Taking App (Backend)

Proyecto basado en el roadmap [roadmap.sh/projects/markdown-note-taking-app](https://roadmap.sh/projects/markdown-note-taking-app), implementado con **Express.js**, **TypeScript** y **ESLint**.

Este backend provee un API REST para gestionar notas en formato Markdown.

---

## 🚀 Tecnologías utilizadas
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/) (con configuración recomendada para TS)
- [http-status-codes](https://www.npmjs.com/package/http-status-codes) (para manejar códigos de estado legibles)

---

## 📂 Estructura del proyecto

```
express_notes_md/
│── src/
│   ├── controllers/
│   │   └── noteController.ts   # Controladores: manejan req/res
│   ├── services/
│   │   └── noteService.ts      # Lógica de negocio (CRUD de notas)
│   ├── routes/
│   │   └── noteRoutes.ts       # Rutas de la API
│   ├── app.ts                  # Configuración de Express
│   └── server.ts               # Punto de entrada
│
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

---

## 📌 Endpoints disponibles

### Crear nota
```http
POST /api/notes
Content-Type: application/json

{
  "title": "Mi primera nota",
  "content": "Contenido en **Markdown**"
}
```
📥 **Respuesta**
```json
{
  "id": "1",
  "title": "Mi primera nota",
  "content": "Contenido en **Markdown**"
}
```

---

### Listar todas las notas
```http
GET /api/notes
```

---

### Obtener una nota por ID
```http
GET /api/notes/:id
```

---

### Actualizar una nota
```http
PUT /api/notes/:id
Content-Type: application/json

{
  "title": "Título actualizado",
  "content": "Nuevo contenido"
}
```
👉 Si solo se manda `title` o `content`, se actualiza el campo enviado.

---

### Eliminar una nota
```http
DELETE /api/notes/:id
```
📥 **Respuesta exitosa**
```json
{
  "message": "Note deleted successfully"
}
```

📥 **Si no existe**
```json
{
  "message": "Note not found"
}
```

---

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

3. Compilar TypeScript:
   ```bash
   npm run build
   ```

4. Iniciar servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Iniciar servidor en producción:
   ```bash
   npm start
   ```

---

## 🧪 Pruebas con Postman

Ejemplo de colección:

1. **POST** `http://localhost:3000/api/notes`
   - Body: JSON con `title` y `content`.
2. **GET** `http://localhost:3000/api/notes`
3. **GET** `http://localhost:3000/api/notes/1`
4. **PUT** `http://localhost:3000/api/notes/1`
   - Body: JSON con campos a actualizar.
5. **DELETE** `http://localhost:3000/api/notes/1`

---

## ✨ Próximos pasos
- Persistencia en base de datos (ej: PostgreSQL o MongoDB).
- Autenticación de usuarios (JWT).
- Tests automatizados (Jest/Supertest).

---
