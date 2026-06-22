# GB Knowledge Base — Instruções para Claude Code

Documentação para trabalhar com este projeto no Claude Code.

## Visão geral

**GB Knowledge Base** é repositório de aprendizado pessoal + portfólio técnico focado em **.NET + AppSec**, alinhado com transição de carreira para **AppSec Engineer** (6 meses).

- **Desenvolvedor:** Gabriel Biel (@bieltrue95)
- **Email:** devgtrue@gmail.com
- **Propósito:** Knowledge base pública + referência de estudo
- **URL:** https://bieltrue95.github.io/gb-kb
- **Deploy:** Automático (push main → GitHub Pages, ~2min)
- **Stack:** Astro v5 + Starlight + Markdown

---

## Contexto do projeto

Contexto compartilhado em `/Context/gb-kb-template/`:

- **Regras de conteúdo:** `.claude/rules/content-guidelines.md`
- **Skills:** `.claude/skills/add-content/` (criar novo artigo)
- **Documentação:** `/Context/gb-kb-template/README.md`

Economiza tokens ao reutilizar contexto entre projetos KB.

---

## Comandos principais

```bash
npm install               # Instalar dependências (primeira vez)
npm run dev               # Rodar localhost:4321/gb-kb
npm run build             # Build para produção
npm run preview           # Visualizar build localmente
```

---

## Adicionar novo conteúdo

### Método 1: Usar skill (automático)
```bash
/add-content
# Claude cria arquivo, frontmatter, template
```

### Método 2: Manual

1. Criar arquivo em `src/content/docs/{categoria}/{topico}.md`
2. Incluir frontmatter obrigatório:
```yaml
---
title: Título em sentence case
description: Uma linha descrevendo (máx 160 chars)
---
```

3. Seguir estrutura:
```markdown
## Introdução
Por quê aprender?

## Conceitos principais
Explicação clara.

## Na prática
Exemplos em C#.

## Armadilhas comuns
O quê evitar.

## Referências
Links externos.
```

### Regras (ver `.claude/rules/content-guidelines.md`)
- ✅ Português brasileiro
- ✅ Exemplos em C# quando possível
- ✅ Títulos em sentence case
- ✅ Arquivo em kebab-case: `jwt-seguro.md`
- ✅ Validar: `npm run build`

---

## Verificação obrigatória

Antes de fazer push, SEMPRE rodar:

```bash
npm run validate    # Validar frontmatter + estrutura
npm run build       # Verificar build sem erros
npm run lint        # Ambas (atalho)
```

**Regras de validação:** `.claude/rules/content-checklist.md`

Se falhar, corrigir e rodar novamente. GitHub Actions vai bloquear merge se não passar.

---

## Estrutura de pastas

```
gb-kb/
├── .claude/                       # Contexto reutilizável (copiar de template)
├── .github/workflows/
│   └── deploy.yml                # Pipeline CI/CD
├── src/
│   ├── content/docs/
│   │   ├── index.md
│   │   ├── dotnet/               # C#, ASP.NET, arquitetura
│   │   ├── appsec/               # OWASP, Burp, segurança
│   │   └── ferramentas/          # Docker, GitHub Actions, Azure
│   └── styles/custom.css         # Customizações
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Roadmap de conteúdo

### .NET & C# (Fundação)
- ✅ SOLID Principles
- ⏳ Entity Framework Core
- ⏳ ASP.NET Core
- ⏳ Padrões (Repository, Unit of Work, CQRS)
- ⏳ Microserviços

### AppSec (Foco de carreira)
- ✅ OWASP Top 10
- ✅ Burp Suite
- ⏳ SAST com Semgrep
- ⏳ Threat Modeling
- ⏳ JWT seguro
- ⏳ Security Headers

### Ferramentas & DevOps
- ⏳ Docker
- ⏳ GitHub Actions
- ⏳ Azure
- ⏳ Semgrep

---

## Plano de transição AppSec (6 meses)

| Fase | Período | Foco | Resultado |
|------|---------|------|-----------|
| 1 | Mês 1-2 | Google Cert, TryHackMe, OWASP | KB + labs |
| 2 | Mês 2-4 | Burp Suite, PortSwigger, SAST | Proficiency |
| 3 | Mês 4-5 | CompTIA Security+, portfólio | Certificação |
| 4 | Mês 6 | Aplicar para AppSec | Transição |

---

## Troubleshooting

### `npm run dev` não inicia
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build falha
- Verificar frontmatter YAML (title + description obrigatórios)
- Verificar arquivo em kebab-case
- Rodar: `npm run build` para ver erro exato

### Deploy não funciona
- Verificar: push foi para `main`
- Aguardar: ~2 min
- Verificar: Actions no GitHub

---

## Git workflow

```bash
# Criar branch
git checkout -b feature/seu-topico

# Editar conteúdo
# src/content/docs/...

# Validar ANTES de push
npm run lint              # Tudo de uma vez

# Se passou ✅:
git add src/content/docs/ .claude/
git commit -m "docs: adicionar [topico]"

# Push (GitHub Actions valida automaticamente)
git push origin feature/seu-topico

# GitHub Actions vai:
# 1. Validar frontmatter ✅
# 2. Validar estrutura ✅
# 3. Verificar build ✅
# 4. Comentar resultado no PR
# 5. Bloquear merge se falhar ❌
```

**GitHub Actions:** `.github/workflows/validate-content.yml`

---

## ⚠️ Git Commits — CRÍTICO

**NUNCA adicionar co-author Claude nos commits.**

- Você é o autor único — Claude é ferramenta de assistência, não contributor
- Se cometer esse erro, corrigir IMEDIATAMENTE com:
  ```bash
  git commit --amend -m "mensagem sem co-author"
  git push origin branch --force-with-lease
  ```
- Se já foi pusheado para main, avisar para reescrever histórico com `git filter-branch`

---

## Links úteis

- **Site ao vivo:** https://bieltrue95.github.io/gb-kb
- **GitHub:** https://github.com/bieltrue95/gb-kb
- **Docs Astro:** https://docs.astro.build
- **Docs Starlight:** https://starlight.astro.build
- **Context central:** `/Context/README.md`
- **Template KB:** `/Context/gb-kb-template/README.md`

---

## Notas para Claude Code

- Contexto carregado de `/Context/gb-kb-template/.claude/`
- Reutilizável em múltiplos projetos KB
- Economiza tokens (cached por 5 min)
- Customizar: editar `.claude/rules/content-guidelines.md`
- Adicionar skill: criar `./claude/skills/{nome}/SKILL.md`
