# Kobi Website — API Documentation

Base URL (dev): `http://localhost:4000/api/v1`

সব response wrapper:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": { ... },
  "timestamp": "2025-01-01T00:00:00.000Z"
}

Error format:

{
  "success": false,
  "statusCode": 400,
  "message": "কিছু একটা ভুল হয়েছে",
  "errors": null,
  "path": "/api/v1/...",
  "method": "POST",
  "timestamp": "..."
}

Pagination response:

{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10, "hasNext": true, "hasPrev": false },
  "timestamp": "..."
}

Authentication
Method	Path	Auth	Rate
POST	/auth/login	Public	5 / 15m
POST	/auth/refresh	Cookie	—
POST	/auth/logout	Cookie	—
POST	/auth/logout-all	Bearer	—
GET	/auth/me	Bearer	—


Public Content
Method	Path	Description
GET	/homepage	হোমপেজ content (hero + featured)
GET	/homepage/full	হোমপেজ aggregate (hero + latest + featured + about)
GET	/about	লেখকের পরিচিতি
GET	/settings	সাইট সেটিংস (public subset)
GET	/categories?type=lyric	category তালিকা
GET	/categories/:slug	একটি category
GET	/poems?page=1&limit=10&search=&category=&tag=&sort=latest	কবিতা তালিকা
GET	/poems/featured	নির্বাচিত কবিতা
GET	/poems/:slug	একটি কবিতা
POST	/poems/:slug/view	View count increment
GET	/lyrics?...	লিরিক তালিকা
GET	/lyrics/featured	নির্বাচিত লিরিক
GET	/lyrics/:slug	একটি লিরিক
POST	/lyrics/:slug/view	View count increment
GET	/search?q=&type=all&page=1&limit=10	গ্লোবাল সার্চ
GET	/seo/sitemap-data	Sitemap data
GET	/seo/rss-data	RSS items
GET	/preview/:token	Draft preview (token)
GET	/health	Health check

Admin (Bearer + role=admin)
Categories
GET /admin/categories • POST /admin/categories • PATCH /admin/categories/:id • DELETE /admin/categories/:id

Poems
GET /admin/poems • POST /admin/poems • GET /admin/poems/:id • PATCH /admin/poems/:id • PATCH /admin/poems/:id/status • PATCH /admin/poems/:id/featured • DELETE /admin/poems/:id • DELETE /admin/poems/:id/hard • POST /admin/poems/:id/preview-token

Lyrics (analogous)
GET /admin/lyrics • POST /admin/lyrics • ... (same set)

About / Homepage / Settings
GET|PATCH /admin/about • GET|PATCH /admin/homepage • GET|PATCH /admin/settings

Media
GET /admin/media • POST /admin/media/upload • POST /admin/media/upload-many • DELETE /admin/media/:id • DELETE /admin/media/folder/:folder

Authentication Flow
Login: POST /auth/login → returns accessToken (body) + refresh_token (HTTP-only cookie)

Requests: Send Authorization: Bearer <accessToken>

Refresh (when access expires): POST /auth/refresh (cookie auto-sent) → new accessToken + rotated cookie

Logout: POST /auth/logout → cookie cleared, token revoked

Cookie flags: httpOnly, secure (prod), sameSite=strict (prod) / lax (dev), path=/api/v1/auth


---

## 6.10 — Nginx Configuration

### `docs/04-deployment.md` + `deploy/nginx/kobi-website.conf`

```nginx
# /etc/nginx/sites-available/kobi-website
# symlink to /etc/nginx/sites-enabled/

# ---------- API (backend) ----------
upstream api_backend {
    server 127.0.0.1:4000;
    keepalive 64;
}

# ---------- WEB (public) ----------
upstream web_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# ---------- ADMIN ----------
upstream admin_backend {
    server 127.0.0.1:3001;
    keepalive 64;
}

# ============ API SUBDOMAIN ============
server {
    listen 80;
    server_name api.kobi-name.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.kobi-name.com;

    ssl_certificate     /etc/letsencrypt/live/api.kobi-name.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kobi-name.com/privkey.pem;

    client_max_body_size 20M;
    gzip on;
    gzip_types application/json;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}

# ============ WEB (public site) ============
server {
    listen 80;
    server_name kobi-name.com www.kobi-name.com;
    return 301 https://kobi-name.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kobi-name.com www.kobi-name.com;

    ssl_certificate     /etc/letsencrypt/live/kobi-name.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kobi-name.com/privkey.pem;

    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# ============ ADMIN SUBDOMAIN ============
server {
    listen 80;
    server_name admin.kobi-name.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.kobi-name.com;

    ssl_certificate     /etc/letsencrypt/live/admin.kobi-name.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.kobi-name.com/privkey.pem;

    # Optional: IP whitelist — শুধু নির্দিষ্ট IP থেকে অ্যাডমিন অ্যাক্সেস
    # allow 1.2.3.4;
    # deny all;

    location / {
        proxy_pass http://admin_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}