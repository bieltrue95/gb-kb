---
title: Strangler Fig pattern
description: Migração incremental de sistemas legados em 3 fases sem big bang rewrite
emoji: 🌿
---

## Introdução

O **Strangler Fig Pattern** é uma estratégia de **migração incremental** de sistemas legados para novas arquiteturas, sem fazer um big bang rewrite. O nome vem da biologia: uma figueira estranguladora cresce envolvendo uma árvore gradualmente até substituí-la.

**Por que importa:** Big bang rewrites têm ~70% de taxa de falha. O Strangler Fig entrega valor incrementalmente, permite rollback e mantém o sistema em produção durante toda a migração.

## Conceitos principais

### As 3 fases

**1. Fase de Proxy (Strangling)**
- Um proxy (ex: YARP) fica entre cliente e sistema
- Roteia tráfego: algumas requisições → novo, outras → legado
- Inicialmente: 100% legado

**2. Fase de Dual Write**
- Novas requisições escrevem em AMBOS os sistemas
- Sistema novo "aprende" com dados do legado
- Sincronização em tempo real

**3. Fase de Sync Job**
- Dados históricos copiados incrementalmente
- Background job sincroniza divergências
- Legado → read-only → desligado
- Finalmente: 100% novo

### Vantagens sobre big bang

| Aspecto | Big Bang | Strangler |
|---|---|---|
| Taxa de falha | ~70% | <10% |
| Time to value | 18-24 meses | 3-4 meses |
| Rollback | Impossível | Trivial |
| Risk | Total | Incremental |

## Na prática

### Exemplo: Migrar pagamentos com YARP

```csharp
// Program.cs
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

app.MapReverseProxy();
```

```json
// appsettings.json
{
  "ReverseProxy": {
    "Routes": {
      "payments-new": {
        "ClusterId": "newPayment",
        "Match": {
          "Path": "/api/payments/{**catch-all}",
          "Methods": ["POST"]
        },
        "Priority": 10
      },
      "payments-legacy": {
        "ClusterId": "legacy",
        "Match": { "Path": "/api/payments/{**catch-all}" }
      }
    },
    "Clusters": {
      "newPayment": {
        "Destinations": {
          "new": { "Address": "http://new-api:5000" }
        }
      },
      "legacy": {
        "Destinations": {
          "legacy": { "Address": "http://legacy:8080" }
        }
      }
    }
  }
}
```

### Dual write com sincronização

```csharp
public class PaymentService
{
    public async Task CreatePayment(Payment payment)
    {
        // Escreve no novo
        await _newRepo.AddAsync(payment);

        // Escreve no legado (best-effort)
        try
        {
            await _legacy.CreateAsync(payment, timeout: 5_000);
        }
        catch (TimeoutException ex)
        {
            _logger.LogWarning($"Legacy timeout para {payment.Id}");
            // Sync job cuida depois
        }

        await _newRepo.SaveChangesAsync();
    }
}
```

### Background sync job

```csharp
public class PaymentSyncJob : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            var divergent = await _newRepo
                .GetDivergentPayments(since: DateTime.UtcNow.AddHours(-1));

            foreach (var p in divergent)
            {
                try
                {
                    await _legacy.CreateAsync(p);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Sync falhou para {PaymentId}", p.Id);
                }
            }

            await Task.Delay(TimeSpan.FromMinutes(5), ct);
        }
    }
}
```

## Armadilhas comuns

❌ **Migrar tudo de uma vez** → Defina uma rota por semana

❌ **Sincronizar em cascata** → Novo é sempre fonte de verdade

❌ **Ignorar latência do proxy** → Monitore roteamento (é crítico)

❌ **Rollback sem plano** → Mantenha dados sincronizados

❌ **Deixar legado em produção demais** → Defina data fixa de desligamento

## Referências

- [Martin Fowler — Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html)
- [YARP Reverse Proxy](https://microsoft.github.io/reverse-proxy/)
- [Sam Newman — Building Microservices](https://samnewman.io/books/building_microservices/)
