---
title: Security Headers
description: Content-Security-Policy, HSTS, X-Frame-Options, CORS — proteção no navegador
emoji: 🔐
---

## Introdução

**Security Headers** = instruções HTTP ao navegador. Protegem contra XSS, clickjacking, MIME sniffing, etc. Defesa em camadas.

## Principais Headers

| Header | Proteção | Exemplo |
|---|---|---|
| **CSP** | XSS, injection | `default-src 'self'` |
| **X-Frame-Options** | Clickjacking | `DENY` |
| **X-Content-Type-Options** | MIME sniffing | `nosniff` |
| **HSTS** | Force HTTPS | `max-age=31536000` |
| **X-XSS-Protection** | XSS legacy | `1; mode=block` |
| **Referrer-Policy** | Info disclosure | `strict-origin` |
| **Permissions-Policy** | Feature abuse | `geolocation=()` |

## Na prática

### Middleware customizado

```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Add("Permissions-Policy", "geolocation=(), microphone=()");
    
    await next();
});
```

### Extension method (reutilizável)

```csharp
public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            context.Response.Headers["X-Content-Type-Options"] = "nosniff";
            context.Response.Headers["X-Frame-Options"] = "DENY";
            context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000";
            context.Response.Headers["Content-Security-Policy"] = "default-src 'self'";
            await next();
        });
        return app;
    }
}

// Usar
app.UseSecurityHeaders();
```

## Armadilhas comuns

❌ **CSP muito permissivo** → `unsafe-inline` = XSS hole

❌ **Headers inconsistentes** → Alguns endpoints protegidos, outros não

❌ **Ignorar browser compatibility** → Alguns headers são legacy

❌ **Não testar** → CSP quebra scripts legítimos

## Referências

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [MDN HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)
- [SecurityHeaders.com](https://securityheaders.com)
