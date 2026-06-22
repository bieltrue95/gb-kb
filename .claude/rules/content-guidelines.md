# Content Guidelines — GB Knowledge Base

Standards for all content in Knowledge Base projects (Astro + Starlight).

## Frontmatter (Obrigatório)

Cada artigo DEVE ter:

```yaml
---
title: Título em sentence case
description: Uma linha descrevendo o assunto (máx 160 chars)
---
```

**Regras:**
- `title`: Comece com maiúscula, mas apenas primeira palavra (sentence case)
- `description`: Breve resumo, max 160 caracteres, sem ponto final
- Nunca deixe campos vazios

## Estrutura de Artigo

```markdown
## Introdução
Por quê aprender isso? Contexto e relevância prática.

## Conceitos principais
Explicação clara, sem jargão desnecessário.
- Ponto 1
- Ponto 2

## Na prática
Exemplos de código em C# quando possível.
Demonstre com casos reais.

## Armadilhas comuns
O quê evitar? Erros frequentes que encontrará.
- Erro 1: Explicação
- Erro 2: Explicação

## Referências
- Link 1
- Link 2
```

## Convenções de Linguagem

**SEMPRE:**
- ✅ Português brasileiro
- ✅ Exemplo em C# quando possível
- ✅ Incluir seção prática/hands-on
- ✅ Títulos em sentence case (`Autenticação JWT`, não `Autenticação Jwt`)
- ✅ Foco em aplicabilidade prática
- ✅ Código com syntax highlighting: ```` ```csharp ``` ````

**NUNCA:**
- ❌ Conteúdo genérico (especialize em .NET + AppSec)
- ❌ Sem exemplos práticos
- ❌ Frontmatter inválido
- ❌ Espaços em nomes de arquivo

## Nomes de Arquivo

- **Kebab-case**: `jwt-seguro.md` não `JWT Seguro.md`
- **Inglês técnico OK**: `sql-injection.md` (melhor que `injeção-sql`)
- **Descritivo**: `jwt-validacao.md` melhor que `jwt.md`
- **Sem espaços**: sempre
- **Minúsculo**: sempre

## Exemplo Prático

### ❌ Ruim
```markdown
---
title: SOLID
description: Princípios SOLID
---

SOLID é um acrônimo...
```

### ✅ Bom
```markdown
---
title: Princípios SOLID em C#
description: Entenda os 5 princípios SOLID e como aplicar em ASP.NET Core
---

## Introdução
SOLID são 5 princípios que...

## Na prática
Exemplo de Single Responsibility em C#:
```csharp
public class UserService
{
    public void CreateUser(User user) { }
}
```
```

## Links Internos

Use sintaxe Starlight:

```markdown
[Veja JWT seguro](/gb-kb/appsec/jwt-seguro/)
```

## Markdown Permitido

- ✅ Headings (##, ###, ####)
- ✅ **Bold**, *italic*
- ✅ Code blocks com syntax highlighting
- ✅ Listas (-, *, 1.)
- ✅ Blockquotes (>)
- ✅ Tabelas
- ✅ Links
- ❌ HTML raw (use markdown equivalente)

## Código

### C# blocks
```csharp
public class Example
{
    public void Method() { }
}
```

### Bash/PowerShell
```bash
npm run dev
git add .
```

### Sempre cite a linguagem na fence
```csharp
// correto
```

```
// ❌ evitar (sem linguagem)
```

## Prova de Conteúdo

Antes de fazer commit:

1. ✅ Frontmatter válido (title + description)
2. ✅ Arquivo em kebab-case
3. ✅ Tem seção "Na prática" com código
4. ✅ Português brasileiro
5. ✅ `npm run build` sem erros
6. ✅ Exemplo em C# se faz sentido
