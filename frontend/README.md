# Arrenda Web

> **Repo canónico:** [jhoncarlosam-dev/arrenda-web](https://github.com/jhoncarlosam-dev/arrenda-web) (raíz del repo, no anidado). Esta carpeta `frontend/` en [arrenda](https://github.com/jhoncarlosam-dev/arrenda) es la copia de implementación original.

Frontend React de **Arrenda**, sistema de gestión de contratos de arrendamiento. Interfaz en español para roles `ARRENDADOR` y `ARRENDATARIO`.

Habla con la API FastAPI (`jhoncarlosam-dev/arrenda`) vía JWT Bearer.

## Stack

React 18 · Vite 5 · TailwindCSS 3 · React Router v6 · Axios · React Hook Form · react-hot-toast

## Requisitos

- Node.js 18+
- API Arrenda en `http://localhost:8000` (ver el repositorio backend)

## Cómo ejecutar

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La app queda en [http://localhost:5173](http://localhost:5173). En desarrollo, Vite también puede hacer proxy de `/api` hacia `http://127.0.0.1:8000` (útil si CORS o el host difieren).

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Para usar el proxy: `VITE_API_BASE_URL=/api/v1`.

Las variables `VITE_*` se embeben en el build; no pongas secretos aquí.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `:5173` |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |

## Rutas

| Ruta | Acceso |
|------|--------|
| `/login` | Público |
| `/registro` | Público |
| `/recuperar` | Público |
| `/restablecer` | Público |
| `/verificar-email` | Público |
| `/` o `/panel` | Autenticado |
| `/contratos` | Autenticado |
| `/contratos/nuevo` | ARRENDADOR |
| `/contratos/:id` | Parte del contrato |
| `/contratos/:id/editar` | ARRENDADOR propietario |
| `/perfil` | Autenticado |

## Auth

Tras `POST /auth/login` se guarda `access_token`. Axios añade `Authorization: Bearer <token>`. Un 401 cierra sesión y redirige a `/login`.

## Estructura

```
src/
├── api/           # Cliente Axios y módulos por dominio
├── auth/          # AuthContext (JWT + rol)
├── components/    # Layout, UI, contratos
├── pages/         # Pantallas
├── routes/        # PrivateRoute y AppRoutes
└── utils/         # Formato, JWT, errores API
```
