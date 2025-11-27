# Configuração do App Facebook para Localhost

## ✅ Sim, é possível usar localhost!

O Facebook permite configurar `localhost` como URL de redirecionamento para desenvolvimento.

## 📋 Passo a Passo

### 1. Criar App no Meta for Developers

1. Acesse: https://developers.facebook.com/apps/
2. Clique em **"Criar App"**
3. Selecione o tipo: **"Business"** ou **"Other"**
4. Preencha:
   - Nome do App: `Meta Ads Platform` (ou o nome que preferir)
   - Email de contato: seu email
   - Finalidade: selecione conforme sua necessidade

### 2. Adicionar Produtos

No painel do app, adicione os seguintes produtos:

#### Facebook Login

1. Clique em **"Adicionar Produto"**
2. Selecione **"Facebook Login"**
3. Configure:
   - **Configurações** → **Configurações Básicas**
   - **URLs de Redirecionamento OAuth Válidas**:
     ```
     http://localhost:3000/api/auth/facebook/callback
     ```
   - **Domínios do App**: deixe vazio ou adicione `localhost`

#### Marketing API

1. Clique em **"Adicionar Produto"**
2. Selecione **"Marketing API"**
3. Isso é necessário para acessar dados de anúncios

### 3. Solicitar Permissões

1. Vá em **"Permissões e Recursos"** → **"Permissões do Usuário"**
2. Adicione as seguintes permissões:
   - `ads_read` - Ler dados de anúncios
   - `business_management` - Gerenciar Business Managers

### 4. Configurar URLs de Redirecionamento

No **Facebook Login** → **Configurações**:

**URLs de Redirecionamento OAuth Válidas:**

```
http://localhost:3000/api/auth/facebook/callback
```

**Importante:**

- Use `http://` (não `https://`) para localhost
- A porta deve ser exatamente `3000` (ou a que você usa)
- O caminho deve ser exatamente `/api/auth/facebook/callback`

### 5. Obter Credenciais

1. Vá em **"Configurações"** → **"Básico"**
2. Copie:
   - **ID do App** → `FACEBOOK_APP_ID`
   - **Chave Secreta do App** → `FACEBOOK_APP_SECRET`

### 6. Configurar Variáveis de Ambiente

No arquivo `.env.local`:

```env
FACEBOOK_APP_ID="seu-app-id-aqui"
FACEBOOK_APP_SECRET="seu-app-secret-aqui"
FACEBOOK_REDIRECT_URI="http://localhost:3000/api/auth/facebook/callback"
NEXTAUTH_URL="http://localhost:3000"
```

### 7. Testar

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3000`
3. Faça login
4. Vá em Dashboard → Conectar com Facebook
5. Você será redirecionado para o Facebook
6. Autorize o app
7. Será redirecionado de volta para `http://localhost:3000/dashboard?connected=true`

## ⚠️ Importante

### Modo de Desenvolvimento

- O app começa em **Modo de Desenvolvimento**
- Apenas você e usuários de teste podem usar
- Para produção, precisa submeter para revisão do Facebook

### Adicionar Usuários de Teste

1. Vá em **"Funções"** → **"Funções"**
2. Clique em **"Adicionar"** → **"Testadores"**
3. Adicione os emails dos usuários que podem testar

### Limitações do Modo de Desenvolvimento

- Apenas desenvolvedores e testadores podem autorizar
- Algumas permissões podem precisar de revisão para produção
- Rate limits mais baixos

## 🔄 Para Produção

Quando for para produção:

1. Altere as URLs de redirecionamento para seu domínio:

   ```
   https://seu-dominio.com/api/auth/facebook/callback
   ```

2. Submeta o app para revisão do Facebook (se necessário)

3. Atualize as variáveis de ambiente:
   ```env
   FACEBOOK_REDIRECT_URI="https://seu-dominio.com/api/auth/facebook/callback"
   NEXTAUTH_URL="https://seu-dominio.com"
   ```

## 🐛 Troubleshooting

### Erro: "URL de redirecionamento inválida"

- Verifique se a URL está exatamente igual no Facebook e no `.env.local`
- Certifique-se de usar `http://` (não `https://`) para localhost
- Verifique se a porta está correta

### Erro: "App não autorizado"

- Verifique se você está logado com uma conta que tem acesso ao app
- Adicione sua conta como testador no painel do Facebook

### Erro: "Permissões não concedidas"

- Verifique se as permissões `ads_read` e `business_management` estão configuradas
- Algumas permissões podem precisar de revisão do Facebook

## 📚 Recursos

- [Documentação Facebook Login](https://developers.facebook.com/docs/facebook-login)
- [Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Guia de Permissões](https://developers.facebook.com/docs/permissions/reference)
