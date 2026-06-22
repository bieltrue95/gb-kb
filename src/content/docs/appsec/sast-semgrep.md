---
title: SAST com Semgrep
description: Static Application Security Testing — encontrar vulnerabilidades no código-fonte
emoji: 🔎
---

## Introdução

**SAST** = Static Application Security Testing. Analisa código-fonte sem executar. **Semgrep** = rápido, agnóstico, acha padrões perigosos (SQL injection, XSS, hardcoded secrets, etc).

## Conceitos principais

### SAST vs DAST vs IAST

| Tipo     | Quando                      | Desvantagem     |
| -------- | --------------------------- | --------------- |
| **SAST** | Build-time (código)         | False positives |
| **DAST** | Runtime (aplicação rodando) | Mais lento      |
| **IAST** | Runtime com instrumentação  | Complexo setup  |

### Semgrep rules

```yaml
rules:
  - id: hardcoded-password
    pattern: password = "..."
    message: Senha hardcoded
    severity: HIGH
```

## Na prática

### Instalação e uso

```bash
# Instalar
pip install semgrep

# Rodar
semgrep --config p/security-audit src/

# Com regras customizadas
semgrep --config my-rules.yml .
```

### GitHub Actions integração

```yaml
name: SAST
on: [push]
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: semgrep --config p/security-audit --json --output report.json src/
      - uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: report.json
```

## Armadilhas comuns

❌ **100% automático** → False positives, precisa reviewer

❌ **Ignorar "low" severity** → Podem ser críticas em contexto

❌ **Sem atualização** → Regras ficam defasadas

## Referências

- [Semgrep Docs](https://semgrep.dev/docs)
- [Rules Registry](https://semgrep.dev/r)
- [OWASP SAST Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools)
