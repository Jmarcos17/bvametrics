# Meta Ads Platform

Plataforma de conexão com Meta (Facebook/Instagram) Ads para automação de relatórios via n8n.

## 🚀 Funcionalidades

- ✅ Autenticação completa (login/registro)
- ✅ Conexão OAuth com Facebook
- ✅ Gerenciamento de tokens long-lived (60 dias)
- ✅ Criptografia AES-256-GCM para tokens
- ✅ Painel administrativo
- ✅ API REST para integração com n8n
- ✅ Interface moderna e responsiva

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL (recomendado: [Neon](https://neon.tech))
- Conta no [Meta for Developers](https://developers.facebook.com/)

## 🛠️ Instalação

1. **Clone o repositório e instale as dependências:**

```bash
cd meta-ads-platform
npm install
```

2. **Configure as variáveis de ambiente:**

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
# Database (Neon)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"

# Facebook OAuth
FACEBOOK_APP_ID="seu-app-id"
FACEBOOK_APP_SECRET="seu-app-secret"
FACEBOOK_REDIRECT_URI="http://localhost:3000/api/auth/facebook/callback"

# Encryption (32 bytes hex)
ENCRYPTION_KEY="gerar-com-openssl-rand-hex-32"

# n8n API Key
N8N_API_KEY="gerar-com-openssl-rand-base64-32"
```

3. **Configure o banco de dados:**

```bash
# Gerar Prisma Client
npm run db:generate

# Criar migrations
npm run db:migrate

# Ou push direto (desenvolvimento)
npm run db:push
```

4. **Configure o App Facebook:**

**✅ Sim, funciona em localhost!** O Facebook permite usar `localhost` para desenvolvimento.

📖 **Guia completo:** Veja [CONFIGURACAO_FACEBOOK.md](./CONFIGURACAO_FACEBOOK.md) para instruções detalhadas.

**Resumo rápido:**
1. Acesse [Meta for Developers](https://developers.facebook.com/apps/)
2. Crie um novo app do tipo **Business**
3. Adicione o produto **Facebook Login**
4. Adicione o produto **Marketing API**
5. Configure as URLs de redirecionamento:
   - `http://localhost:3000/api/auth/facebook/callback` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/facebook/callback` (produção)
6. Solicite as permissões:
   - `ads_read`
   - `business_management`
7. Copie o **App ID** e **App Secret** para o `.env.local`

5. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📚 Estrutura do Projeto

```
meta-ads-platform/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # Autenticação
│   │   │   ├── connections/    # CRUD conexões
│   │   │   └── n8n/            # API para n8n
│   │   ├── dashboard/          # Dashboard cliente
│   │   ├── admin/              # Painel admin
│   │   ├── login/              # Página de login
│   │   └── register/           # Página de registro
│   ├── components/             # Componentes React
│   ├── lib/                    # Utilitários
│   │   ├── auth.ts             # Helpers de autenticação
│   │   ├── db.ts               # Cliente Prisma
│   │   ├── encryption.ts       # Criptografia
│   │   ├── facebook-api.ts     # Cliente Graph API
│   │   └── facebook-oauth.ts   # OAuth helpers
│   └── types/                  # TypeScript types
└── .env.local                  # Variáveis de ambiente (não commitado)
```

## 🔐 Segurança

- Tokens são criptografados com AES-256-GCM antes de salvar no banco
- API n8n protegida por API key
- Middleware de autenticação em todas as rotas protegidas
- Validação de state no OAuth callback (CSRF protection)

## 🔌 Integração com n8n

Consulte [API_DOCS.md](./API_DOCS.md) para documentação completa da API.

### Exemplo básico:

```javascript
// n8n HTTP Request Node
const response = await fetch('https://seu-dominio.com/api/n8n/tokens', {
  headers: {
    'x-api-key': process.env.N8N_API_KEY
  }
});

const tokens = await response.json();

// Para cada token, fazer chamadas à Facebook Graph API
for (const token of tokens) {
  const insights = await fetch(
    `https://graph.facebook.com/v19.0/${token.adAccountIds[0]}/insights?access_token=${token.accessToken}`
  );
  // Processar insights...
}
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run db:generate` - Gera Prisma Client
- `npm run db:push` - Push schema para banco (dev)
- `npm run db:migrate` - Cria migration
- `npm run db:studio` - Abre Prisma Studio

## 🚢 Deploy

**📖 Guia completo:** Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy.

### Opções Recomendadas:

1. **Vercel** (Mais fácil) - Deploy em minutos
2. **Railway** - Com PostgreSQL incluído
3. **Render** - Plano gratuito disponível

### Deploy Rápido na Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

Depois configure as variáveis de ambiente no dashboard da Vercel.

### ⚠️ Importante para Produção:

1. Atualize as URLs no Facebook App para seu domínio de produção
2. Configure todas as variáveis de ambiente
3. Use HTTPS (fornecido automaticamente pela Vercel)
4. Teste o fluxo OAuth completo após o deploy

## 📖 Documentação Adicional

- [API Documentation](./API_DOCS.md) - Documentação da API para n8n
- [PRD Original](../prd-meta-ads.md) - Documento de requisitos do produto

## ⚠️ Notas Importantes

1. **Tokens expiram em 60 dias** - Implemente notificações para renovação
2. **Rate Limiting** - Respeite os limites da Facebook Graph API
3. **HTTPS obrigatório em produção** - Para segurança dos tokens
4. **Backup do ENCRYPTION_KEY** - Sem ele, tokens não podem ser descriptografados

## 🤝 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.

## 📄 Licença

Este projeto é privado e proprietário.
