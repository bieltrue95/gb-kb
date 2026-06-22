---
title: CQRS e event sourcing
description: Command Query Responsibility Segregation — separa escrita e leitura
emoji: 📖
---

## Introdução

**CQRS** = Command Query Responsibility Segregation. Separa lado escrita (commands) do lado leitura (queries). Cada um otimiza pro seu caso (write-heavy vs read-heavy).

**Event Sourcing** = não guarda estado final, guarda histórico de eventos que levam ao estado.

## Conceitos principais

### Command vs Query

```csharp
// Command: muta estado
public class CreateOrderCommand
{
    public int UserId { get; set; }
    public List<OrderItem> Items { get; set; }
}

// Query: lê estado
public class GetOrdersByUserQuery
{
    public int UserId { get; set; }
}
```

### Event Sourcing

```csharp
// Em vez de salvar estado:
public class Order { public int Id; public OrderStatus Status; }

// Salva eventos:
public class OrderCreated { public int OrderId; public DateTime CreatedAt; }
public class OrderShipped { public int OrderId; }
public class OrderCancelled { public int OrderId; }

// Estado é reconstruído a partir dos eventos
var events = new[] { new OrderCreated(), new OrderShipped() };
var order = Rebuild(events); // Status = Shipped
```

## Na prática

### MediatR (command handler)

```csharp
// Command
public class CreateOrderCommand : IRequest<int>
{
    public int UserId { get; set; }
    public List<OrderItem> Items { get; set; }
}

// Handler
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, int>
{
    public async Task<int> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        var order = new Order { UserId = request.UserId, Items = request.Items };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);

        return order.Id;
    }
}

// Dispatch
var orderId = await _mediator.Send(new CreateOrderCommand { ... });
```

### Event sourcing with store

```csharp
public class OrderEventStore
{
    public async Task AppendAsync(object @event)
    {
        _db.Events.Add(new StoredEvent
        {
            AggregateId = orderId,
            EventType = @event.GetType().Name,
            Payload = JsonSerializer.Serialize(@event),
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }

    public async Task<Order> RebuildAsync(int orderId)
    {
        var events = await _db.Events.Where(e => e.AggregateId == orderId).ToListAsync();

        var order = new Order();
        foreach (var e in events)
        {
            if (e is OrderCreated oc) order.Status = OrderStatus.Created;
            if (e is OrderShipped os) order.Status = OrderStatus.Shipped;
        }
        return order;
    }
}
```

## Vantagens

✅ **Auditoria completa** — histórico de todas as mudanças

✅ **Escalabilidade** — comando (slow, atômico) separado de query (rápido, paralelo)

✅ **Undo/Replay** — refazer até um ponto no tempo

## Armadilhas comuns

❌ **Eventual consistency** → Queries podem estar desatualizadas

❌ **Complexidade** → Not every app precisa CQRS

❌ **Dual write** → Pode divergir entre command store e query model

## Referências

- [Martin Fowler — CQRS](https://martinfowler.com/bliki/CQRS.html)
- [MediatR](https://github.com/jbogard/MediatR)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
