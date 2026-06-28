---
title: OWASP Top 10
description: As 10 vulnerabilidades mais críticas em aplicações web — com exemplos em .NET
emoji: ⚠️
tags: [appsec, owasp, segurança, web]
---

## O que é o OWASP Top 10

Lista das 10 vulnerabilidades mais críticas em aplicações web, mantida pela OWASP (Open Worldwide Application Security Project). Atualizada periodicamente com base em dados reais de ataques.

---

## A01 — Broken Access Control

Controle de acesso falho. Usuário acessa recursos que não deveria.

```csharp
// ❌ Endpoint sem verificação de autorização
[HttpGet("/api/users/{id}")]
public async Task<User> GetUser(int id)
{
    return await _repo.GetById(id); // qualquer um pode pegar qualquer usuário
}

// ✅ Verificando se o usuário logado é dono do recurso
[HttpGet("/api/users/{id}")]
[Authorize]
public async Task<User> GetUser(int id)
{
    var currentUserId = User.GetUserId();
    if (currentUserId != id) return Forbid();
    return await _repo.GetById(id);
}
```

---

## A02 — Cryptographic Failures

Dados sensíveis expostos por falhas de criptografia.

```csharp
// ❌ Senha em texto plano no banco
user.Password = password;

// ✅ Hash com BCrypt
user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
```

---

## A03 — Injection

SQL Injection, NoSQL Injection, Command Injection.

```csharp
// ❌ SQL dinâmico — vulnerável a SQL Injection
var query = $"SELECT * FROM Users WHERE Name = '{name}'";

// ✅ Parâmetros — EF Core já protege por padrão
var user = await _db.Users
    .Where(u => u.Name == name)
    .FirstOrDefaultAsync();
```

---

## A07 — Identification and Authentication Failures

Falhas em autenticação e gerenciamento de sessão.

```csharp
// ✅ JWT com expiração curta + refresh token
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // sem tolerância de expiração
        };
    });
```

---

## Como estudar na prática

| Recurso                     | O que oferece                                     |
| --------------------------- | ------------------------------------------------- |
| **PortSwigger Web Academy** | Labs práticos pra cada vulnerabilidade — gratuito |
| **OWASP WebGoat**           | App .NET vulnerável pra explorar localmente       |
| **OWASP ASVS**              | Checklist de verificação de segurança por nível   |

---

## Referências

- [OWASP Top 10 oficial](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

## Ver também

- [Broken Access Control](./broken-access-control.mdx)
- [JWT Seguro](./jwt-seguro.mdx)
- [Security Headers](./security-headers.md)
- [Threat Modeling](./threat-modeling.md)
- [SAST com Semgrep](./sast-semgrep.md)
- [Burp Suite](./burp-suite.md)
