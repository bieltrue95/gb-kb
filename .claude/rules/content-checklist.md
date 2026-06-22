# Content Checklist — Validação Automática

Checklist automático para validar qualidade de artigos antes de commit.

## ✅ Validação Automática (npm run validate)

O script `scripts/validate-content.js` verifica:

### Frontmatter (YAML)
- ✅ `title` existe e começa com maiúscula
- ✅ `description` existe e tem < 160 chars
- ✅ Sintaxe YAML válida

### Estrutura de arquivo
- ✅ Nome em kebab-case (sem espaços, minúsculo)
- ✅ Arquivo `.md` (não `.txt`, `.doc`, etc)
- ✅ Localizado em `src/content/docs/{categoria}/`

### Conteúdo obrigatório
- ✅ Seção `## Introdução` (por quê aprender?)
- ✅ Seção `## Conceitos principais` (o quê?)
- ✅ Seção `## Na prática` (como? exemplos de código)
- ✅ Tem exemplo de código (``` ou `````)

### Padrão
```bash
# Rodar antes de commit
npm run validate

# Se passar ✅
git add .
git commit -m "docs: add [topico]"

# Se falhar ❌
# Corrigir e rodar novamente
```

---

## 📋 Checklist Manual (Claude Code)

Usar este checklist quando criar novo artigo com `/add-content`:

### Antes de fazer commit

- [ ] **Frontmatter OK?**
  - [ ] `title` em sentence case
  - [ ] `description` < 160 chars
  - [ ] Nenhum campo vazio

- [ ] **Arquivo OK?**
  - [ ] Nome em kebab-case
  - [ ] Localizado em `src/content/docs/{categoria}/`
  - [ ] Extensão `.md`

- [ ] **Estrutura OK?**
  - [ ] `## Introdução` explicando por quê
  - [ ] `## Conceitos principais` com pontos-chave
  - [ ] `## Na prática` com exemplo de código
  - [ ] `## Armadilhas comuns` (se aplicável)
  - [ ] `## Referências` com links

- [ ] **Conteúdo OK?**
  - [ ] Português brasileiro
  - [ ] Exemplo em C# (quando possível)
  - [ ] Sem jargão excessivo
  - [ ] Foco em aplicabilidade prática

- [ ] **Validação OK?**
  - [ ] `npm run validate` passou ✅
  - [ ] `npm run build` passou ✅
  - [ ] `npm run dev` preview OK

---

## 🚀 Usar no workflow

### Ao fazer push
1. Clone/checkout branch
2. Editar `src/content/docs/{categoria}/{arquivo}.md`
3. Rodar `npm run validate`
4. Se OK ✅:
   ```bash
   git add .
   git commit -m "docs: add [topico]"
   git push origin feature/your-branch
   ```
5. GitHub Actions roda check automático

### Se GitHub Actions falhar
- Ler comentário no PR com erro específico
- Corrigir localmente
- Rodar `npm run validate` para confirmar
- Fazer push novo (atualiza PR automaticamente)

---

## 📝 Exemplos

### ❌ Artigo inválido

```markdown
---
title: OWASP Top 10
description: 
---

Conteúdo aqui
```

**Erros:**
- `description` vazio
- Falta seções obrigatórias

### ✅ Artigo válido

```markdown
---
title: OWASP Top 10: Broken Access Control
description: Entenda e previna vulnerabilidades de controle de acesso
---

## Introdução
Broken Access Control é a vulnerabilidade #1 do OWASP...

## Conceitos principais
- O quê é BAC
- Por quê é perigoso
- Exemplos reais

## Na prática
Exemplo em C#:
```csharp
// Código aqui
```

## Armadilhas comuns
- Erro 1
- Erro 2

## Referências
- Link 1
```

---

## 🔧 Customizar validação

Se quiser adicionar novas regras:

1. Editar `scripts/validate-content.js`
2. Adicionar nova função de validação
3. Testar: `npm run validate`
4. Commit: `git add scripts/ && git commit -m "chore: enhance validation"`

---

## 🤖 Integração com Claude Code

Quando usar `/add-content` skill:
- Claude cria arquivo com template
- Template já passa validação
- Claude pode rodar `npm run validate` para confirmar
- Se falhar, Claude corrige e tenta novamente

---

## 📊 Status de validação

Rode antes de cada commit:

```bash
npm run validate    # Validar conteúdo
npm run build       # Build Astro
npm run lint        # Ambas (validate + build)
```

Se tudo ✅ passar, pode fazer push com confiança!
