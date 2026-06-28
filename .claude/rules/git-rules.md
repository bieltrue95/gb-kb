# Regras Git — GB Knowledge Base

Regras obrigatórias para Claude Code ao trabalhar com git neste repositório.

---

## ⛔ REGRA #1 — NUNCA adicionar co-author Claude

```bash
# ❌ ERRADO — NUNCA fazer isso
git commit -m "docs: adicionar jwt
Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"

# ✅ CORRETO — apenas a mensagem
git commit -m "docs: adicionar jwt"
```

**Por quê:** Gabriel já reescreveu o histórico git inteiro (74 commits) e deletou o repositório remoto por causa desse erro. Uma vez, nunca mais.

**Se errar antes do push:**
```bash
git commit --amend -m "mensagem sem co-author"
```

**Se já pushado para branch:**
```bash
git push origin branch --force-with-lease
```

**Se chegou ao main:** avisar Gabriel imediatamente — vai precisar de `git filter-branch` ou recriar o repositório.

---

## Convenção de mensagens de commit

Seguir Conventional Commits (formato: `tipo: descrição`):

| Tipo     | Quando usar                               |
| -------- | ----------------------------------------- |
| `docs:`  | Novo artigo ou atualização de conteúdo    |
| `fix:`   | Correção de bug, link quebrado, frontmatter |
| `chore:` | Scripts, configuração, dependências       |
| `style:` | CSS, tema, visual — sem mudança de conteúdo |
| `refactor:` | Reorganização sem mudança de comportamento |

Exemplos:
```bash
git commit -m "docs: adicionar jwt-seguro"
git commit -m "docs: atualizar owasp-top10 com exemplos C#"
git commit -m "fix: corrigir frontmatter de security-headers"
git commit -m "chore: atualizar astro.config.mjs sidebar"
git commit -m "style: ajustar tema escuro reading.css"
```

---

## Nomeação de branches

```
docs/nome-do-topico         # novo artigo
fix/descricao-do-bug        # correção
chore/descricao-da-tarefa   # manutenção
```

---

## Arquivos a adicionar no commit

Para um novo artigo, adicionar apenas:
```bash
git add src/content/docs/{categoria}/{arquivo}.md
git add astro.config.mjs   # se adicionou entrada na sidebar
git add .claude/           # se atualizou regras/skills
```

Evitar `git add .` ou `git add -A` — pode incluir arquivos temporários ou de build.

---

## Fluxo completo seguro

```bash
# 1. Criar branch
git checkout -b docs/topico

# 2. Escrever conteúdo

# 3. Validar
npm run lint
npm run build

# 4. Commit SEM co-author
git add src/content/docs/...
git commit -m "docs: adicionar [topico]"

# 5. Push
git push origin docs/topico
```

---

## O que NÃO fazer

- ❌ `git add .` sem revisar o que está sendo adicionado
- ❌ `git commit --amend` em commits já pushados para main
- ❌ `git push --force` no main (usar `--force-with-lease` em branches)
- ❌ Commitar arquivos de build (`dist/`, `.astro/`)
- ❌ Commitar `node_modules/`
- ❌ Qualquer variação de `Co-Authored-By: Claude`
