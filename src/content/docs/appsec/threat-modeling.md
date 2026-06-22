---
title: Threat Modeling
description: Identificar e mitigar ameaças estruturadamente com STRIDE
emoji: 🧨
---

## Introdução

**Threat Modeling** = processo estruturado para identificar, documentar e mitigar ameaças antes de exploração. Não é paranoia, é planejamento.

## Conceitos principais

### STRIDE (6 categorias de ameaça)

| Ameaça | Exemplo | Mitigação |
|---|---|---|
| **S**poofing | Falsificar identidade | Autenticação forte |
| **T**ampering | Modificar dados | Integridade (HMAC, assinatura) |
| **R**epudiation | Negar ação | Logging, auditoria |
| **I**nformation Disclosure | Vazar dados | Criptografia, RBAC |
| **D**enial of Service | Derruba serviço | Rate limiting, failover |
| **E**levation of Privilege | Aumentar permissões | Princípio mínimo acesso |

### DFD (Data Flow Diagram)

```
[User] --> [API] --> [Database]
            ↓
        [Cache]
```

## Na prática

### Exemplo: API de pagamentos

```
1. Identificar assets: cartão, saldo, transação
2. Identificar atores: user, admin, attacker
3. Mapear fluxo: User → API → Payment Gateway → Bank
4. Listar ameaças STRIDE
5. Priorizar por risco (impact × likelihood)
6. Mitigar
```

### Checklist de ameaças por componente

```csharp
// API Endpoint
// [S] Falsa identidade → JWT + signature validation
// [T] Request tampering → HTTPS + request signing
// [I] Response disclosure → Não expor stack trace, IDs internos
// [D] Rate limiting → RateLimitPolicy
```

## Armadilhas comuns

❌ **Muito teórico** → Focar em ameaças reais do contexto

❌ **Sem atualização** → Threat model muda com código

❌ **Sem priorização** → Focar nas ameaças de alto risco

## Referências

- [STRIDE Model](https://learn.microsoft.com/en-us/archive/blogs/larryosterman/threat-modeling-again-stride-vs-dread)
- [OWASP Threat Modeling](https://owasp.org/www-community/Threat_Model)
- [Microsoft Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)
