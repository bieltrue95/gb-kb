---
title: Burp Suite
description: Primeiros passos com Burp Suite para análise de segurança em aplicações web
emoji: 🧪
tags: [appsec, segurança, web, pentest]
---

## O que é

Burp Suite é a ferramenta padrão do mercado para testes de segurança em aplicações web. Age como um proxy entre o navegador e o servidor — interceptando, analisando e modificando requisições HTTP em tempo real.

## Versões

| Versão           | Custo    | Uso                      |
| ---------------- | -------- | ------------------------ |
| **Community**    | Gratuita | Aprendizado, uso pessoal |
| **Professional** | Pago     | Pentest profissional     |

Para estudo, a Community já é suficiente.

---

## Instalação

1. Baixar em [portswigger.net/burp](https://portswigger.net/burp)
2. Instalar o certificado CA do Burp no navegador
3. Configurar o proxy no navegador: `127.0.0.1:8080`

---

## Funcionalidades principais

### Proxy

Intercepta e modifica requisições antes de chegarem ao servidor. Principal ferramenta do dia a dia.

### Repeater

Reenvia requisições modificadas manualmente. Útil para testar variações de um mesmo ataque.

### Intruder

Automatiza ataques com listas de payloads. Útil para brute force e fuzzing de parâmetros.

### Scanner (Pro)

Varre automaticamente a aplicação em busca de vulnerabilidades conhecidas.

---

## Primeiro teste prático

O melhor lugar para praticar com Burp Suite é o **PortSwigger Web Academy**:

👉 [portswigger.net/web-security](https://portswigger.net/web-security)

Todos os labs são gratuitos e já vêm com aplicações vulneráveis prontas pra atacar.

---

## Dica para devs .NET

Ao testar sua própria API ASP.NET Core com Burp, configure o proxy no `HttpClient` do seu cliente de teste:

```csharp
var handler = new HttpClientHandler
{
    Proxy = new WebProxy("http://127.0.0.1:8080"),
    UseProxy = true,
    ServerCertificateCustomValidationCallback = (_, _, _, _) => true
};
var client = new HttpClient(handler);

## Ver também

- [OWASP Top 10](./owasp-top10.md)
- [Threat Modeling](./threat-modeling.md)
- [SAST com Semgrep](./sast-semgrep.md)
```
