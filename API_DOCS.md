# API Documentation - n8n Integration

Esta documentação descreve os endpoints da API disponíveis para integração com n8n.

## Autenticação

Todos os endpoints da API n8n requerem autenticação via header `x-api-key`.

```
x-api-key: YOUR_N8N_API_KEY
```

## Endpoints

### GET /api/n8n/tokens

Retorna todos os tokens ativos de todos os usuários.

**Headers:**
```
x-api-key: YOUR_N8N_API_KEY
```

**Response 200:**
```json
[
  {
    "userId": "uuid",
    "userEmail": "user@example.com",
    "userName": "User Name",
    "fbUserId": "123456789",
    "businessIds": ["123", "456"],
    "adAccountIds": ["act_123", "act_456"],
    "accessToken": "decrypted-access-token",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "dataAccessExpiresAt": "2024-12-31T23:59:59.000Z"
  }
]
```

**Response 401:**
```json
{
  "error": "Unauthorized"
}
```

### GET /api/n8n/tokens/[userId]

Retorna o token ativo de um usuário específico.

**Headers:**
```
x-api-key: YOUR_N8N_API_KEY
```

**Response 200:**
```json
{
  "userId": "uuid",
  "userEmail": "user@example.com",
  "userName": "User Name",
  "fbUserId": "123456789",
  "businessIds": ["123", "456"],
  "adAccountIds": ["act_123", "act_456"],
  "accessToken": "decrypted-access-token",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "dataAccessExpiresAt": "2024-12-31T23:59:59.000Z"
}
```

**Response 404:**
```json
{
  "error": "No connection found for user"
}
```

**Response 410:**
```json
{
  "error": "Token expired",
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

**Response 401:**
```json
{
  "error": "Unauthorized"
}
```

## Exemplo de uso no n8n

### Workflow: Relatórios Diários

1. **HTTP Request Node** - Buscar tokens
   - Method: GET
   - URL: `https://your-domain.com/api/n8n/tokens`
   - Headers:
     - `x-api-key`: `{{$env.N8N_API_KEY}}`

2. **Code Node** - Processar tokens
   - Para cada token, fazer chamadas à Facebook Graph API

3. **HTTP Request Node** - Buscar insights
   - URL: `https://graph.facebook.com/v19.0/{ad_account_id}/insights`
   - Query params:
     - `access_token`: `{{$json.accessToken}}`
     - `fields`: `campaign_name,impressions,clicks,spend`
     - `date_preset`: `yesterday`

### Workflow: Relatórios Semanais

Similar ao diário, mas usando `date_preset: last_7d` ou `time_range`.

## Notas Importantes

1. **Tokens são descriptografados automaticamente** - Não é necessário descriptografar manualmente.

2. **Tokens expirados são filtrados** - O endpoint `/api/n8n/tokens` retorna apenas tokens válidos.

3. **Rate Limiting** - Respeite os limites da Facebook Graph API (200 calls/hour por usuário).

4. **Segurança** - Mantenha o `N8N_API_KEY` seguro e nunca o exponha publicamente.

5. **Renovação de Tokens** - Tokens long-lived expiram em 60 dias. Implemente um workflow para notificar usuários quando o token estiver próximo do vencimento.

## Facebook Graph API Resources

- [Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis)
- [Insights API](https://developers.facebook.com/docs/marketing-api/insights)
- [Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)

