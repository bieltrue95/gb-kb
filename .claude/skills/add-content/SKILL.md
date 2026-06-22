# add-content — Create Knowledge Base Article

Skill for creating new KB articles following content guidelines.

## Usage

`/add-content`

## What it does

1. Asks for topic and category
2. Creates `.md` file with frontmatter
3. Generates template structure
4. Validates frontmatter
5. Suggests examples in C#
6. Verifies build works

## Workflow

```bash
# User runs
/add-content

# Claude:
# - Asks: Category? (dotnet, appsec, ferramentas)
# - Asks: Topic title?
# - Creates file in src/content/docs/{category}/{topic}.md
# - Fills template
# - Runs: npm run build
# - Reports: Ready to edit or errors
```

## Template Generated

```markdown
---
title: [User's title]
description: [Auto-generated from title]
---

## Introdução

Contexto e por quê aprender isso.

## Conceitos principais

- Conceito 1
- Conceito 2

## Na prática

Exemplo de código em C#.

## Armadilhas comuns

- Erro 1
- Erro 2

## Referências

- Link 1
```

## Validation

After creation, checks:

- ✅ Frontmatter is valid YAML
- ✅ File in correct location
- ✅ Filename is kebab-case
- ✅ Title is sentence case
- ✅ Description < 160 chars
- ✅ `npm run build` succeeds

## Next Steps

After creation:

1. Edit file in `src/content/docs/{category}/{filename}.md`
2. Add content sections (Introdução, Conceitos, Na prática, etc)
3. Include C# examples where relevant
4. Run `npm run dev` to preview
5. Commit: `git add . && git commit -m "docs: add [topic]"`
