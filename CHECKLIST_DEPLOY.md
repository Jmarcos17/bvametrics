# ✅ Checklist de Deploy

Use este checklist antes de fazer deploy em produção.

## 📋 Pré-Deploy

### 1. Build Local
- [ ] `npm run build` executa sem erros
- [ ] `npm run start` inicia corretamente
- [ ] Testado localmente (quando possível)

### 2. Variáveis de Ambiente

Certifique-se de ter todas configuradas na plataforma de deploy:

- [ ] `DATABASE_URL` - URL do banco de dados (Neon)
- [ ] `NEXTAUTH_URL` - URL da aplicação (ex: `https://seu-app.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - Chave secreta (gerada com `node scripts/generate-keys.js`)
- [ ] `FACEBOOK_APP_ID` - ID do app Facebook
- [ ] `FACEBOOK_APP_SECRET` - Secret do app Facebook
- [ ] `FACEBOOK_REDIRECT_URI` - URL de callback (ex: `https://seu-app.vercel.app/api/auth/facebook/callback`)
- [ ] `ENCRYPTION_KEY` - Chave de criptografia (32 bytes hex)
- [ ] `N8N_API_KEY` - Chave da API n8n

### 3. Configuração do Facebook App

- [ ] App criado no Meta for Developers
- [ ] Facebook Login adicionado como produto
- [ ] Marketing API adicionado como produto
- [ ] URL de redirecionamento configurada: `https://seu-dominio.com/api/auth/facebook/callback`
- [ ] Permissões solicitadas: `ads_read`, `business_management`
- [ ] App em modo de desenvolvimento ou revisão aprovada

### 4. Banco de Dados

- [ ] Banco de dados Neon criado e acessível
- [ ] Migrations aplicadas (`npm run db:migrate`)
- [ ] Prisma Client gerado (`npm run db:generate`)
- [ ] Conexão testada

### 5. Segurança

- [ ] Todas as chaves geradas com segurança
- [ ] `.env.local` não está no repositório
- [ ] HTTPS configurado (automático na Vercel)
- [ ] Variáveis sensíveis não expostas

## 🚀 Deploy

### Vercel

- [ ] Conta Vercel criada
- [ ] Projeto conectado ao repositório
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] Domínio configurado

### Railway/Render

- [ ] Conta criada
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] Domínio configurado

## 🧪 Pós-Deploy

### Testes

- [ ] Aplicação acessível via URL de produção
- [ ] Login funciona
- [ ] Registro funciona (se habilitado)
- [ ] Dashboard carrega
- [ ] Conexão Facebook funciona
- [ ] OAuth callback funciona
- [ ] Tokens são salvos corretamente
- [ ] API n8n responde (com API key)

### Verificações

- [ ] Logs sem erros críticos
- [ ] Performance aceitável
- [ ] HTTPS funcionando
- [ ] Redirecionamentos corretos

## 📝 Documentação

- [ ] README atualizado
- [ ] Variáveis de ambiente documentadas
- [ ] Instruções de deploy documentadas

## 🎉 Pronto!

Após completar todos os itens, sua aplicação está pronta para uso em produção!

