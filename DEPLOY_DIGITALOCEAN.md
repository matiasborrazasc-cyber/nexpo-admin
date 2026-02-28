# Despliegue del Admin (Frontend) en DigitalOcean - Ubuntu

Guía paso a paso para instalar el panel de administración (React/Vite) en un Droplet Ubuntu de DigitalOcean.

---

## Requisitos previos

- La **API** debe estar desplegada y funcionando (ej: `http://64.23.187.211:3000`)
- El archivo `src/services/auth.service.ts` debe tener `FAIR_API_BASE` apuntando a tu API de producción

---

## Paso 1: Crear el Droplet (o usar uno existente)

1. [DigitalOcean](https://cloud.digitalocean.com/) → **Create** → **Droplets**
2. **Imagen**: Ubuntu 24.04 LTS
3. **Plan**: Basic $6/mes (1 GB RAM) es suficiente para un frontend estático
4. **Región**: La misma que tu API (para menor latencia)
5. Crea y anota la **IP pública**

---

## Paso 2: Conectarte por SSH

```bash
ssh root@TU_IP_PUBLICA
```

---

## Paso 3: Actualizar el sistema

```bash
apt update && apt upgrade -y
```

---

## Paso 4: Instalar Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

---

## Paso 5: Instalar Nginx

```bash
apt install -y nginx
```

---

## Paso 6: Crear directorio de la aplicación

```bash
mkdir -p /var/www/admin-fair
cd /var/www/admin-fair
```

---

## Paso 7: Subir el código

**Opción A: Subir el build desde tu máquina local (recomendado)**

En tu Mac/PC, primero compila el admin con la API de producción ya configurada:

```bash
cd /ruta/a/nexpo-frontend
npm run build
```

Luego sube la carpeta `dist`:

```bash
scp -r dist index.html root@TU_IP_PUBLICA:/var/www/admin-fair/
```

**Opción B: Con Git (compilar en el servidor)**

En el servidor:

```bash
apt install -y git
cd /var/www/admin-fair
git clone https://github.com/TU_USUARIO/TU_REPO.git .
cd nexpo-frontend   # si está en una subcarpeta
npm install
npm run build
```

---

## Paso 8: Verificar que existe la carpeta dist

```bash
ls -la /var/www/admin-fair/dist
```

Deberías ver `index.html` y la carpeta `assets/` con los archivos JS y CSS.

---

## Paso 9: Configurar Nginx

```bash
nano /etc/nginx/sites-available/admin-fair
```

Pega esta configuración (reemplaza `TU_IP_O_DOMINIO`):

```nginx
server {
    listen 80;
    server_name TU_IP_O_DOMINIO;
    root /var/www/admin-fair/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activa el sitio:

```bash
ln -s /etc/nginx/sites-available/admin-fair /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

## Paso 10: Firewall (opcional)

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## Paso 11: Probar

Abre en el navegador:

```
http://TU_IP_PUBLICA
```

Deberías ver la pantalla de login del admin. Inicia sesión con las credenciales de tu base de datos.

---

## Configurar la URL de la API

Antes de hacer el build, asegúrate de que `src/services/auth.service.ts` tenga:

```typescript
export const FAIR_API_BASE = 'http://TU_IP_API:3000';
```

O si usas un dominio para la API:

```typescript
export const FAIR_API_BASE = 'https://api.tudominio.com';
```

---

## Actualizar el admin después de cambios

**Si subes el build desde local:**

```bash
# En tu Mac/PC
cd nexpo-frontend
npm run build
scp -r dist root@TU_IP:/var/www/admin-fair/
```

**Si usas Git y compilas en el servidor:**

```bash
cd /var/www/admin-fair
git pull
npm install
npm run build
```

No hace falta reiniciar Nginx: los archivos estáticos se sirven directamente.

---

## Usar un dominio (opcional)

1. En tu proveedor de dominios, crea un registro **A** apuntando a la IP del Droplet
2. En Nginx, cambia `server_name` por tu dominio (ej: `admin.tuferia.com`)
3. Para HTTPS con Let's Encrypt:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d admin.tuferia.com
```

---

## Resumen de URLs

| Recurso | URL |
|---------|-----|
| Admin | `http://TU_IP` |
| API (si está en otro servidor) | `http://TU_IP_API:3000` |

Si API y Admin están en el mismo Droplet, puedes servir el admin en el puerto 80 y la API en el 3000, o configurar Nginx como proxy para ambos.
