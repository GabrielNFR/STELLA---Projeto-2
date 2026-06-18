# Guia de Contribuição — STELLA

Bem-vindo(a) à equipe! Este documento contém tudo o que você precisa saber para configurar o ambiente e contribuir com código no projeto STELLA.

## Visão Geral

STELLA é uma plataforma **SPA desacoplada**: o frontend (React + Vite) roda independente do backend (Django REST), comunicando-se exclusivamente via API JSON.

| Camada | Tecnologia | Porta padrão |
|--------|-----------|-------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind v4 | `5173` |
| Backend | Django 6.0 + Django REST Framework | `8000` |
| Banco | SQLite (desenvolvimento) | — |

---

## Primeira Configuração (Setup Inicial)

Após clonar o repositório, você precisa de **dois terminais** abertos simultaneamente.

### Terminal 1 — Backend (Django)

```bash
cd backend

# Crie e ative o ambiente virtual
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Rode as migrações
python manage.py migrate

# Crie um superusuário (para acessar o admin)
python manage.py createsuperuser

# Inicie o servidor
python manage.py runserver
```

A API estará em: `http://127.0.0.1:8000/api/tratamento/`  
O Admin em: `http://127.0.0.1:8000/admin/`

### Terminal 2 — Frontend (Vite)

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A interface estará em: `http://localhost:5173`

---

## Estrutura do Projeto

```
STELLA---Projeto-2/
├── README.md
├── CONTRIBUTING.md
├── .gitignore
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── core/                  ← Configuração do Django (settings, urls raiz)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── tratamento/            ← App principal (models, views, serializers, urls)
│       ├── models.py          ← TODOS os modelos de banco
│       ├── serializers.py     ← Serializadores DRF
│       ├── views.py           ← ViewSets e APIViews
│       ├── urls.py            ← Rotas da API
│       └── admin.py           ← Registro no painel admin
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html             ← Entry point HTML
    ├── public/                ← Arquivos estáticos (favicon, etc.)
    └── src/
        ├── main.tsx           ← Entry point React (TanStack Router Provider)
        ├── index.css          ← Tailwind + variáveis de tema
        ├── routeTree.gen.ts   ← Auto-gerado pelo TanStack Router CLI
        ├── lib/
        │   └── utils.ts       ← Função cn() para classes CSS
        ├── hooks/             ← Hooks React customizados
        ├── components/
        │   ├── ui/            ← Componentes shadcn/ui (Button, Card, etc.)
        │   ├── ui-bits/       ← Componentes compostos (PageHeader, Modal, etc.)
        │   ├── brand/         ← Logos e ilustrações da marca
        │   ├── AppShell.tsx   ← Layout principal (sidebar + conteúdo)
        │   ├── Avatar3D.tsx   ← Avatar com iniciais
        │   ├── MedicationAlertManager.tsx
        │   └── ProfileDropdown.tsx
        └── routes/            ← Páginas da aplicação (TanStack Router)
            ├── __root.tsx     ← Raiz da árvore de rotas
            ├── index.tsx      ← Landing page (rota "/")
            ├── login.tsx      ← Tela de login + AuthLayout
            ├── _app.tsx       ← Layout autenticado (AppShell)
            ├── _app.home.tsx  ← Home (rota "/home")
            ├── _app.timeline.tsx
            ├── _app.calendario.tsx
            ├── _app.copiloto.tsx
            ├── _app.perfil.tsx
            ├── _app.exames.tsx
            ├── _app.medicacoes.tsx
            ├── _app.notas.tsx
            ├── _app.notificacoes.tsx
            ├── _app.como-estou-hoje.tsx
            ├── _app.help.tsx
            ├── _app.contatos.tsx
            ├── _app.videoteca.tsx
            ├── recuperar-senha.tsx
            ├── recuperar-codigo.tsx
            └── convite.$token.tsx
```

### Nova tela no Frontend

1. Crie um arquivo em `frontend/src/routes/` com a convenção do TanStack Router:
   - Rota pública: `minha-rota.tsx` → acessível em `/minha-rota`
   - Rota autenticada: `_app.minha-rota.tsx` → acessível em `/minha-rota` dentro do AppShell

2. Estruture o arquivo no padrão:
   ```tsx
   import { createFileRoute } from "@tanstack/react-router";

   export const Route = createFileRoute("/_app/minha-rota")({
     head: () => ({ meta: [{ title: "Minha Rota — STELLA" }] }),
     component: MinhaPagina,
   });

   function MinhaPagina() {
     return <div>...</div>;
   }
   ```

3. Rode o gerador de rotas para atualizar o `routeTree.gen.ts`:
   ```bash
   npx @tanstack/router-cli generate
   ```

4. Para consumir a API do Django, use sempre o padrão com fallback:
   ```tsx
   const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
   fetch(`${API_BASE}/api/tratamento/meu-endpoint/`)
   ```

### B. Novo modelo/API no Backend

1. Adicione o modelo em `backend/tratamento/models.py`
2. Crie o serializador em `backend/tratamento/serializers.py`
3. Crie a View em `backend/tratamento/views.py`
4. Registre a URL em `backend/tratamento/urls.py`
5. Registre no Admin em `backend/tratamento/admin.py`
6. Rode as migrações:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

---

## Design System e Componentes

### Tema (Cores)
As cores do design system STELLA × AMARE estão definidas como variáveis CSS em `frontend/src/index.css` no bloco `:root`. Use sempre as utility classes do Tailwind:

| Token CSS | Classe Tailwind | Uso |
|-----------|----------------|-----|
| `--rose-deep` | `text-rose-deep`, `bg-rose-deep` | Ações primárias, destaques |
| `--rose-soft` | `bg-rose-soft` | Fundos suaves |
| `--cream` | `bg-cream` | Fundo da página |
| `--ink` | `text-ink` | Texto principal |

### Componentes shadcn/ui
Todos os primitivos estão em `frontend/src/components/ui/`. Use `<Button>`, `<Card>`, `<Dialog>` etc. — **não crie botões com `<button>` puro.**

### Utilitário `cn()`
Para combinar classes condicionais:
```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class")} />
```

### Alias `@/`
O alias `@/` resolve para `frontend/src/`. Use sempre:
```tsx
import { Card } from "@/components/ui-bits/PageHeader";
import { cn } from "@/lib/utils";
```

## APIs Disponíveis (Backend)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tratamento/fases/` | Lista fases do tratamento |
| GET/POST | `/api/tratamento/agenda/` | Consultas e exames |
| GET/POST | `/api/tratamento/diario/` | Registros emocionais |
| POST | `/api/tratamento/copiloto/convidar/` | Criar convite co-piloto |
| GET/POST | `/api/tratamento/medicacoes/` | Medicações |
| GET/PUT/DELETE | `/api/tratamento/medicacoes/{id}/` | Medicamento específico |
| GET/PUT | `/api/tratamento/perfil/` | Dados do perfil |
| PUT | `/api/tratamento/perfil/foto/` | Upload de foto |

> O backend está com `CORS_ALLOW_ALL_ORIGINS = True` apenas para desenvolvimento.

## Checklist Antes de Commitar

- [ ] O frontend compila sem erros: `npm run build`
- [ ] O backend passa nos checks: `python manage.py check`
- [ ] As migrações estão em dia: `python manage.py makemigrations --check --dry-run`
- [ ] Nenhum `console.log` esquecido no código
- [ ] Imports não usados foram removidos
- [ ] A feature foi testada com ambos os servidores rodando


## Dúvidas Comuns

**"Os @import/@theme/@source no CSS dão erro no VS Code"**
→ São diretivas do Tailwind v4. O Vite as compila corretamente. Ignore os falsos positivos do linter CSS.

**"O Django dá 404 na raiz (/) "**
→ O Django só serve API e Admin. Use `localhost:5173` para a interface visual.

**"O `routeTree.gen.ts` está desatualizado"**
→ Rode `npx @tanstack/router-cli generate` na pasta `frontend`.
