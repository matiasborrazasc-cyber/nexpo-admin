# Solución: API bloqueada por Mixed Content

Si el admin está en **HTTPS** (ej. https://dashboard.nexpo.uy) y llama a **HTTP** (http://64.23.187.211:3000), el navegador **bloquea** la petición (Mixed Content).

## Solución: Proxy de la API en Nginx

Hacer que Nginx reciba las peticiones a `/api` en HTTPS y las reenvíe al backend en el puerto 3000.

### 1. Configurar Nginx

En el servidor, edita la config de `dashboard.nexpo.uy`:

```bash
nano /etc/nginx/sites-available/nexpo
```

Dentro del bloque `server` de **dashboard.nexpo.uy**, añade el `location` para la API **antes** del `location /`:

```nginx
server {
    listen 80;
    server_name dashboard.nexpo.uy;
    
    # Proxy de la API al backend en puerto 3000
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    # Uploads (si los servís desde el backend)
    location /uploads {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }

    # App estática (admin)
    root /var/www/admin-fair/dist;
    index index.html;
    location = /soporte { try_files /soporte.html =404; }
    location = /support { try_files /soporte.html =404; }
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Probar y recargar Nginx

```bash
nginx -t
systemctl reload nginx
```

### 3. Configurar el frontend para usar la misma URL

Ahora la API está en `https://dashboard.nexpo.uy/api`. El frontend usa `VITE_API_URL`:

Opciones para `.env.production`:

**Opción A (recomendada):** Misma origen – las peticiones van a `/api/...` en dashboard.nexpo.uy:
```
VITE_API_URL=
```

**Opción B:** URL explícita:
```
VITE_API_URL=https://dashboard.nexpo.uy
```

Si no creas `.env.production`, en producción se usará la misma origen por defecto.

### 4. Recompilar el admin

```bash
cd nexpo-frontend
npm run build
# Subir dist al servidor
scp -r dist/* root@TU_IP:/var/www/admin-fair/
```

### 5. Certificado SSL

Si aún no tenés HTTPS:

```bash
certbot --nginx -d dashboard.nexpo.uy
```

---

## Resumen

| Antes | Después |
|-------|---------|
| Admin: https://dashboard.nexpo.uy | Admin: https://dashboard.nexpo.uy |
| API: http://64.23.187.211:3000 ❌ bloqueado | API: https://dashboard.nexpo.uy/api ✅ |

El frontend llama a `https://dashboard.nexpo.uy/api/admin/login` → Nginx reenvía a `http://127.0.0.1:3000/api/admin/login` → sin Mixed Content.
