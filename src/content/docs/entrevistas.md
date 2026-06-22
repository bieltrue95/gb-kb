---
title: Perguntas de entrevista
description: 30+ perguntas clássicas .NET/C# organizadas por tópico
---

## 🌐 Padrões Distribuídos

<details>
<summary><strong>Por que Strangler Fig em vez de reescrever tudo do zero?</strong></summary>

Big bang rewrite tem ~70% de taxa de falha. Strangler Fig entrega valor incrementalmente, permite rollback e mantém sistema em produção. Um proxy (YARP) roteia tráfego enquanto você migra rota por rota.

👉 [Leia: Strangler Fig Pattern](/gb-kb/distribuidos/strangler-fig/)
</details>

<details>
<summary><strong>Por que usar jitter no exponential backoff?</strong></summary>

Sem jitter, clientes falhados esperam o mesmo delay e tentam simultaneamente (thundering herd). Jitter randomiza, distribuindo carga no tempo e evitando picos.

👉 [Leia: Resilience com Polly](/gb-kb/distribuidos/resilience/)
</details>

<details>
<summary><strong>O que é o Outbox Pattern e qual problema resolve?</strong></summary>

Resolve dual write: salvar BD + publicar broker atomicamente. Evento em tabela `outbox` mesma transação, background service publica depois. Garante at-least-once delivery.

👉 [Leia: Outbox Pattern](/gb-kb/distribuidos/outbox/)
</details>

<details>
<summary><strong>Qual a diferença entre Saga Choreography e Orchestration?</strong></summary>

**Choreography**: serviços publicam eventos, próximo subscreve (descentralizado, difícil debugar). **Orchestration**: orquestrador comanda passo a passo (explícito, escalável).

👉 [Leia: Saga Pattern](/gb-kb/distribuidos/saga/)
</details>

---

## 🔷 C# Fundamentals

<details>
<summary><strong>Qual a diferença entre `IEnumerable` e `IQueryable`?</strong></summary>

`IQueryable` traduz LINQ para SQL via expression trees (filtro no banco). `IEnumerable` carrega tudo em C# (memória). Use `IQueryable` no BD, `AsEnumerable()` pra operações exclusivas C#.

👉 [Leia: Deferred Execution](/gb-kb/distribuidos/deferred-execution/)
</details>

<details>
<summary><strong>Quando usar `record` vs `class`?</strong></summary>

`record`: dados imutáveis, igualdade por valor (DTOs, value objects). `class`: entidades com identidade, estado mutável. Records ganham `with`, `ToString`, `Equals` automático.

👉 [Leia: Immutability em C#](/gb-kb/csharp/immutability/)
</details>

<details>
<summary><strong>Diferença entre `async void` e `async Task`?</strong></summary>

`async void`: não pode ser awaited, exceções derrubam processo. Use só em event handlers. Sempre prefira `Task` ou `Task<T>`.

👉 [Leia: Async/Await](/gb-kb/async/async-await/)
</details>

<details>
<summary><strong>Qual a diferença entre Array, List e HashSet?</strong></summary>

**Array**: tamanho fixo, O(1) acesso. **List**: dinâmico, O(1) append, O(n) busca. **HashSet**: O(1) busca, sem duplicatas, sem ordem.

👉 [Leia: Collections & Generics](/gb-kb/csharp/collections-generics/)
</details>

---

## ⏳ Async & Performance

<details>
<summary><strong>O que é N+1 problem em EF Core?</strong></summary>

1 query inicial + N queries no loop pras relacionadas. **Solução**: `Include()` ou `AsNoTracking()`. Resultado: 1 query no lugar de N+1.

👉 [Leia: LINQ & Deferred](/gb-kb/async/linq/)
</details>

<details>
<summary><strong>Como evitar deadlock com async/await?</strong></summary>

Nunca use `.Result` ou `.Wait()` em async methods — causa deadlock em ASP.NET clássico. Sempre `await`. Se precisar sync, use `RunSynchronously()` com cuidado.

👉 [Leia: Async/Await](/gb-kb/async/async-await/)
</details>

<details>
<summary><strong>Qual a diferença entre lock, SemaphoreSlim e Interlocked?</strong></summary>

**lock**: mutex simples, lento, suporta async (não direto). **SemaphoreSlim**: async-friendly, permite múltiplos threads. **Interlocked**: lock-free, super rápido, operações atômicas.

👉 [Leia: Threading em C#](/gb-kb/async/threading/)
</details>

---

## 💉 Architecture & Design

<details>
<summary><strong>Singleton, Scoped e Transient no DI?</strong></summary>

**Singleton**: 1 instância por app (lifetime). **Scoped**: 1 por request HTTP. **Transient**: nova sempre. Armadilha: Scoped em Singleton = captive dependency.

👉 [Leia: Dependency Injection](/gb-kb/arquitetura/dependency-injection/)
</details>

<details>
<summary><strong>Qual é o problema com herança profunda?</strong></summary>

Herança > 3 níveis fica frágil, difícil debugar, tight coupling. **Solução**: composição > herança. Prefira interfaces + composição.

👉 [Leia: Interfaces vs Abstract](/gb-kb/csharp/interfaces-vs-abstract/)
</details>

<details>
<summary><strong>Como implementar CQRS?</strong></summary>

Separe comandos (escrita, não retorna) de queries (leitura). Use MediatR: `IRequestHandler<CreateOrderCommand>`, `IRequestHandler<GetOrderQuery, Order>`.

👉 [Leia: CQRS & Event Sourcing](/gb-kb/arquitetura/cqrs/)
</details>

---

## 🌍 ASP.NET Core

<details>
<summary><strong>Qual a diferença entre Controllers e Minimal APIs?</strong></summary>

**Controllers**: classe tradicional, mais boilerplate. **Minimal APIs**: endpoints inline, leve, C# 11+. Escolha: Controllers pra grande volume, Minimal pra rápido.

👉 [Leia: REST API Design](/gb-kb/aspnet/rest-api/)
</details>

<details>
<summary><strong>Por que a ordem do middleware importa?</strong></summary>

Pipeline executa em ordem: autenticação antes de autorização, CORS antes de auth. Ordem errada = security hole ou funcionalidade quebrada.

👉 [Leia: Middleware & Pipeline](/gb-kb/aspnet/middleware/)
</details>

<details>
<summary><strong>IMemoryCache vs IDistributedCache?</strong></summary>

**IMemoryCache**: em-processo, rápido, isolado. **IDistributedCache**: Redis/SQL, compartilhado, lento. Use IMemoryCache pra cache local, IDistributedCache pra multi-server.

👉 [Leia: Caching](/gb-kb/aspnet/caching/)
</details>

---

## 🗄️ Data & EF Core

<details>
<summary><strong>O que é Change Tracking no EF Core?</strong></summary>

EF rastreia objetos modificados. SaveChanges() aplica mudanças. `AsNoTracking()` lê sem rastrear (mais rápido, read-only).

👉 [Leia: EF Core Basics](/gb-kb/data/ef-core-basics/)
</details>

<details>
<summary><strong>Como otimizar queries lentas no EF Core?</strong></summary>

Use `ToQueryString()` pra ver SQL. Adicione índices, `Include()` pra relacionados, `AsNoTracking()` pra leitura, split queries pra grandes resultado-sets.

👉 [Leia: LINQ & Deferred](/gb-kb/async/linq/)
</details>

---

## 🧪 Testing & DevOps

<details>
<summary><strong>Qual é a diferença entre unit test e integration test?</strong></summary>

**Unit**: testa 1 função isolada, rápido, muitos. **Integration**: testa sistema inteiro, lento, poucos. Use ambos.

👉 [Leia: Testing & TDD](/gb-kb/devops/testing/)
</details>

---

## 🛡️ Security

<details>
<summary><strong>Qual é o problema com JWT de longa duração?</strong></summary>

Se tokens são roubados, atacante tem acesso por muito tempo. **Solução**: access tokens curtos (15 min) + refresh tokens longos (7 dias), revogação em blacklist.

👉 [Leia: JWT Seguro](/gb-kb/appsec/jwt-seguro/)
</details>

<details>
<summary><strong>Por que usar Security Headers?</strong></summary>

Headers como CSP, HSTS, X-Frame-Options protegem contra XSS, clickjacking, MIME sniffing. Defesa em camadas no navegador.

👉 [Leia: Security Headers](/gb-kb/appsec/security-headers/)
</details>

---

**Total: 30+ perguntas** | Em construção — mais serão adicionadas
