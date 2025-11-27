# Guia de Deploy - Meta Ads Platform

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado - Mais Fácil)

A Vercel é a plataforma criada pelos desenvolvedores do Next.js e oferece deploy gratuito.

#### Passo a Passo:

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Fazer login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Siga as instruções
   - Escolha o projeto
   - Configure as variáveis de ambiente

4. **Configurar Variáveis de Ambiente no Dashboard:**
   - Acesse: https://vercel.com/dashboard
   - Vá em seu projeto → Settings → Environment Variables
   - Adicione todas as variáveis do `.env.local`

5. **Configurar Domínio:**
   - Vercel fornece um domínio gratuito: `seu-projeto.vercel.app`
   - Ou conecte seu domínio personalizado

#### Variáveis de Ambiente na Vercel:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_REDIRECT_URI=https://seu-projeto.vercel.app/api/auth/facebook/callback
ENCRYPTION_KEY=...
N8N_API_KEY=...
```

### 2. Railway

Railway oferece deploy simples com PostgreSQL incluído.

1. Acesse: https://railway.app
2. Conecte seu repositório GitHub
3. Railway detecta automaticamente Next.js
4. Configure as variáveis de ambiente
5. Deploy automático!

### 3. Render

Similar ao Railway, com plano gratuito.

1. Acesse: https://render.com
2. Conecte repositório
3. Selecione "Web Service"
4. Configure variáveis de ambiente
5. Deploy!

## 🔧 Preparação para Produção

### 1. Atualizar URLs no Facebook App

1. Acesse: https://developers.facebook.com/apps/
2. Vá em **Facebook Login** → **Configurações**
3. Adicione a URL de produção:
   ```
   https://seu-dominio.com/api/auth/facebook/callback
   ```
4. Remova ou mantenha localhost (pode manter para desenvolvimento)

### 2. Configurar HTTPS

- Vercel/Railway/Render fornecem HTTPS automaticamente
- Certifique-se de usar `https://` nas URLs

### 3. Verificar Variáveis de Ambiente

Certifique-se de que todas estão configuradas:
- ✅ `DATABASE_URL` - URL do banco de dados
- ✅ `NEXTAUTH_URL` - URL da aplicação (com https://)
- ✅ `NEXTAUTH_SECRET` - Chave secreta
- ✅ `FACEBOOK_APP_ID` - ID do app Facebook
- ✅ `FACEBOOK_APP_SECRET` - Secret do app Facebook
- ✅ `FACEBOOK_REDIRECT_URI` - URL de callback (com https://)
- ✅ `ENCRYPTION_KEY` - Chave de criptografia
- ✅ `N8N_API_KEY` - Chave da API n8n

### 4. Build de Produção

Teste localmente antes de fazer deploy:

```bash
npm run build
npm run start
```

## 🧪 Testar Localmente com Túnel (Alternativa)

Se quiser testar antes de publicar, use **ngrok**:

### Instalação:

```bash
# macOS
brew install ngrok

# Ou baixe de: https://ngrok.com/download
```

### Uso:

1. Inicie sua aplicação:
   ```bash
   npm run dev
   ```

2. Em outro terminal, inicie o ngrok:
   ```bash
   ngrok http 3000
   ```

3. Você receberá uma URL como: `https://abc123.ngrok.io`

4. Configure no Facebook:
   - URL de redirecionamento: `https://abc123.ngrok.io/api/auth/facebook/callback`
   - Atualize `.env.local`:
     ```env
     NEXTAUTH_URL=https://abc123.ngrok.io
     FACEBOOK_REDIRECT_URI=https://abc123.ngrok.io/api/auth/facebook/callback
     ```

5. Reinicie o servidor Next.js

**Nota:** A URL do ngrok muda a cada vez (no plano gratuito). Para URL fixa, use o plano pago.

## 📋 Checklist Pré-Deploy

- [ ] Build local funciona (`npm run build`)
- [ ] Todas as variáveis de ambiente configuradas
- [ ] URLs do Facebook atualizadas para produção
- [ ] Banco de dados acessível da plataforma de deploy
- [ ] HTTPS configurado
- [ ] Testado o fluxo OAuth completo

## 🔐 Segurança em Produção

1. **Nunca commite `.env.local`** - Já está no `.gitignore`
2. **Use HTTPS sempre** - Obrigatório para OAuth
3. **Chaves fortes** - Use o script `generate-keys.js` para gerar
4. **Rate Limiting** - Considere adicionar em produção
5. **Monitoramento** - Configure logs e alertas

## 🐛 Troubleshooting

### Erro: "Invalid redirect_uri"
- Verifique se a URL no Facebook está exatamente igual
- Certifique-se de usar `https://` em produção
- Verifique se não há espaços ou caracteres especiais

### Erro: "Database connection failed"
- Verifique se o banco permite conexões externas
- Verifique firewall/whitelist de IPs
- Neon permite conexões externas por padrão

### Erro: "NEXTAUTH_SECRET not set"
- Configure a variável de ambiente
- Gere uma nova chave se necessário

## 📚 Recursos

- [Vercel Deploy Guide](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

