#!/usr/bin/env node

/**
 * Script para gerar chaves de segurança necessárias
 * Usage: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('🔐 Gerando chaves de segurança...\n');

// NEXTAUTH_SECRET (base64)
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET=');
console.log(nextAuthSecret);
console.log('');

// ENCRYPTION_KEY (hex, 32 bytes = 64 hex chars)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=');
console.log(encryptionKey);
console.log('');

// N8N_API_KEY (base64)
const n8nApiKey = crypto.randomBytes(32).toString('base64');
console.log('N8N_API_KEY=');
console.log(n8nApiKey);
console.log('');

console.log('✅ Chaves geradas! Copie e cole no seu arquivo .env.local');

