# 🌐 DADG Site Principal — Frontend

> Portal institucional do Diretório Acadêmico Diogo Guimarães (DADG IMEPAC Araguari).  
> Interface para consulta de eventos, certificados, coordenadorias e perfil do usuário.

---

## ⚡ Início Rápido

```bash
# 1. Instale as dependências (apenas na primeira vez)
npm install

# 2. Configure o .env.local (copie o template abaixo)
# 3. Inicie o BACKEND primeiro (porta 3000)
# 4. Inicie o frontend
npm run dev
# → http://localhost:3001
```

> ⚠️ **O backend `dadg-certificates` deve estar rodando em `http://localhost:3000` antes do frontend.**

---

## 📡 Arquitetura

Este é o **frontend** — não acessa o banco de dados diretamente.  
Todas as operações de eventos, inscrições e perfil são delegadas ao **backend** via HTTP.

```
Frontend (porta 3001)
    ↓ HTTP fetch com Bearer Token
Backend dadg-certificates (porta 3000)
    ↓ Mongoose
MongoDB Atlas
```

### Variáveis de Ambiente (`.env.local`)

```env
# Login (Zitadel, OIDC)
OIDC_ISSUER=https://www.login.dadg.com.br   # sem barra no fim: é exatamente o "iss" dos tokens
OIDC_CLIENT_ID=<client id do app no Zitadel>
OIDC_CLIENT_SECRET=<secret>
OIDC_AUDIENCE=<ID do projeto no Zitadel>
SESSION_SECRET=<64 caracteres hexadecimais>
APP_BASE_URL=http://localhost:3001   # ← muda em produção

# Backend API URL — OBRIGATÓRIO
BACKEND_URL=http://localhost:3000

# Google Calendar
GOOGLE_API_KEY=...
GOOGLE_CALENDAR_ID=...

# Contentful CMS
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ACCESS_TOKEN=...

# MongoDB (apenas rotas internas de certificados deste site)
MONGODB_URI=mongodb+srv://...
MONGODB_DB=dadg
RATE_LIMIT=15
```

---

## 🗂️ Rotas e Páginas

| Rota | Descrição |
|---|---|
| `/` | Página inicial com estatísticas em tempo real |
| `/eventos` | Lista eventos abertos + calendário Google |
| `/certificados` | Busca de certificados emitidos |
| `/coordenadorias` | Coordenadorias / núcleos acadêmicos |
| `/perfil` | Perfil do usuário logado + histórico de eventos |
| `/sobre` | Sobre o DADG |
| `/contato` | Formulário de contato / ouvidoria |

---

## 🔐 Autenticação

O login é feito pelo servidor do DADG (Zitadel, OIDC), com o módulo `lib/auth` e o `proxy.ts` (middleware global do Next.js).

| Rota | Função |
|---|---|
| `/api/auth/login` | Inicia o login (`?returnTo=/caminho`, `?prompt=create` abre o cadastro) |
| `/api/auth/logout` | Revoga o refresh token, apaga a sessão e sai do servidor de login |
| `/api/auth/callback` | Retorno do servidor de login |

O módulo fica em `lib/auth` (`getSession`, `getAccessToken`). A sessão é um cookie cifrado (`dadg_site_session.0`, `.1`, ...); o `proxy.ts` renova o access token antes de vencer.

---

## 🎫 Fluxo de Eventos e Inscrições

### Página `/eventos`

1. Server Component busca eventos do mês: `GET {BACKEND_URL}/api/v1/events/openForRegistration/AAAA-MM`
2. Se usuário logado: busca inscrições: `GET {BACKEND_URL}/api/v1/events/user/{userId}` (com Bearer Token)
3. Renderiza `EventCard` para cada evento
4. Usuário clica "Inscrever-se": `EventCard` chama o proxy local `POST /api/v1/events/{id}/registration`
5. Usuário clica "Cancelar": `EventCard` chama `DELETE .../registration`
6. O proxy server-side obtém o access token da sessão e encaminha a operação ao backend

### Proxy do Perfil

A página `/perfil` chama `/api/perfil/proxy` (rota interna do Next.js) que:
1. Pega o `accessToken` da sessão (cookie HttpOnly cifrado)
2. Repassa para `GET {BACKEND_URL}/api/v1/user/profile` com `Authorization: Bearer <token>`
3. Retorna o perfil + histórico de eventos + links de certificados

---

## 🏗️ Estrutura de Arquivos Relevantes

```
app/
├── api/
│   ├── get/
│   │   ├── allEvents/        # Eventos para o calendário/home
│   │   ├── eventsByDate/     # Eventos por período
│   │   └── homeStats/        # Estatísticas da home
│   ├── perfil/
│   │   └── proxy/route.ts    # ⭐ Proxy para /api/v1/user/profile no backend
│   └── ouvidoria/            # Formulário de ouvidoria
├── components/
│   ├── EventCard.tsx          # ⭐ Card de evento com inscrição via backend
│   ├── MenuDrawer.tsx         # Header + Drawer lateral
│   ├── MobileBottomNav.tsx    # Navegação mobile
│   └── ...
├── eventos/
│   └── page.tsx              # ⭐ Busca eventos do backend
├── perfil/
│   └── page.tsx              # ⭐ Página de perfil do usuário
└── ...

proxy.ts                      # Middleware global: sessão + Rate Limit
```

---

## 🐛 Problemas Comuns

### "Nenhum evento com inscrições abertas"
→ Normal se o backend não tiver eventos com `statusDetails.status: "PUBLISHED_OPEN"` no mês atual.

### `/perfil` redireciona para login
→ Esperado! O usuário precisa estar logado.

### Erro 502 no perfil após login
→ Backend não está rodando. Verifique se `http://localhost:3000` responde.

### Login retorna 500
→ Verifique `APP_BASE_URL=http://localhost:3001` e as variáveis `OIDC_*` no `.env.local` (o redirect `http://localhost:3001/api/auth/callback` precisa estar cadastrado no app do Zitadel).

---

*DADG IMEPAC Araguari — Maio 2026*
