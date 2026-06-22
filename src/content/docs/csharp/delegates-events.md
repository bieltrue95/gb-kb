---
title: Delegates e events
description: Action/Func (callbacks), events (pub/sub) e async notifications
emoji: 📡
---

## Introdução

**Delegate** = tipo-seguro para apontar pra um método. **Event** = delegate que só pode ser chamado pela classe que a define (encapsulamento). Permite pub/sub sem acoplamento.

Exemplo: `Button` publica `Click` event, `Form` subscribe e responde.

## Conceitos principais

### Delegate vs Action vs Func

```csharp
// Delegate clássico (verbose)
public delegate void MyDelegate(string message);

// Action (sem retorno)
Action<string> log = msg => Console.WriteLine(msg);

// Func (com retorno)
Func<int, int, int> add = (a, b) => a + b;

// Todos são callbacks, Action/Func são genéricos
```

### Event encapsulation

```csharp
// ❌ Sem event: class quebra contrato
public Action<string> OnClick; // Qualquer um chama

button.OnClick = () => "novo"; // Sobrescreve listeners!

// ✅ Com event: só a classe chama
public event Action<string> OnClick;

button.OnClick = () => "novo"; // Erro de compilação ✅
```

## Na prática

### Pub/Sub clássico

```csharp
public class Button
{
    public event EventHandler Clicked; // Event

    public void Click()
    {
        // Só a classe pode invocar
        Clicked?.Invoke(this, EventArgs.Empty);
    }
}

public class Form
{
    private Button _button = new();

    public Form()
    {
        // Subscreve
        _button.Clicked += Button_OnClicked;
    }

    private void Button_OnClicked(object sender, EventArgs e)
    {
        Console.WriteLine("Button clicou!");
    }
}
```

### Custom EventArgs

```csharp
public class OrderCreatedEventArgs : EventArgs
{
    public int OrderId { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class OrderService
{
    public event EventHandler<OrderCreatedEventArgs> OrderCreated;

    public void CreateOrder(int orderId, decimal total)
    {
        OrderCreated?.Invoke(this, new OrderCreatedEventArgs
        {
            OrderId = orderId,
            Total = total,
            CreatedAt = DateTime.UtcNow
        });
    }
}

// Uso
var service = new OrderService();
service.OrderCreated += (s, e) =>
    Console.WriteLine($"Order {e.OrderId}: ${e.Total}");

service.CreateOrder(123, 500);
```

### Async events

```csharp
// ❌ Evento síncrono (bloqueia todos)
public event EventHandler OrderCreated;

// ✅ Evento assíncrono
public event Func<OrderCreatedEventArgs, Task> OrderCreatedAsync;

public async Task CreateOrder(Order order)
{
    // ... lógica ...
    
    if (OrderCreatedAsync != null)
    {
        var tasks = OrderCreatedAsync.GetInvocationList()
            .Cast<Func<OrderCreatedEventArgs, Task>>()
            .Select(h => h(new OrderCreatedEventArgs(order)));
        
        await Task.WhenAll(tasks);
    }
}

// Subscrever assincronamente
service.OrderCreatedAsync += async (e) =>
{
    await _emailService.SendAsync(e.OrderId);
};
```

### Multicast (múltiplos listeners)

```csharp
var action = (Action<string>)null;
action += msg => Console.WriteLine($"1: {msg}");
action += msg => Console.WriteLine($"2: {msg}");
action += msg => Console.WriteLine($"3: {msg}");

action("Hello");
// Output:
// 1: Hello
// 2: Hello
// 3: Hello
```

### Unsubscribe (importante!)

```csharp
private void Form_Load()
{
    _button.Clicked += Button_OnClicked;
}

private void Form_Unload()
{
    _button.Clicked -= Button_OnClicked; // Unsubscribe!
}

// Se não desinscrever, memory leak!
```

## Armadilhas comuns

❌ **Não unsubscribe** → Memory leak (listener vivo quando deveria morrer)

❌ **Exception em um listener quebra outros** → Usar try/catch em cada

❌ **Eventos síncronos pesados** → Callers ficam bloqueados

❌ **Modificar delegate direto** → Use event (encapsula)

❌ **Assume ordem de listeners** → Order não é garantida

## Referências

- [MSDN — Delegates](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/)
- [MSDN — Events](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/events)
- [Action vs Func](https://docs.microsoft.com/en-us/dotnet/api/system.action)
