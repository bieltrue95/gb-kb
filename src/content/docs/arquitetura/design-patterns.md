---
title: Design patterns
description: Strategy, Observer, Factory, Decorator, Repository — soluções testadas
emoji: 🎨
---

## Introdução

**Design patterns** = soluções provadas para problemas comuns. Não invente a roda. 23 padrões clássicos (Gang of Four). Aqui os 5 mais úteis em .NET.

## Conceitos principais

### Strategy (comportamento intercambiável)

```csharp
interface IPricingStrategy { decimal Calculate(decimal price); }

class BlackFridayPricing : IPricingStrategy
{
    public decimal Calculate(decimal price) => price * 0.5m;
}

public class Cart
{
    private IPricingStrategy _pricing;
    
    public Cart(IPricingStrategy pricing) => _pricing = pricing;
    public decimal GetTotal(decimal price) => _pricing.Calculate(price);
}
```

### Factory (criar sem acoplamento)

```csharp
interface IPaymentProcessor { Task<bool> ProcessAsync(Payment p); }

class PaymentFactory
{
    public static IPaymentProcessor Create(string type) => type switch
    {
        "credit" => new CreditCardProcessor(),
        "paypal" => new PayPalProcessor(),
        _ => throw new ArgumentException()
    };
}

// Uso: não precisa conhecer CreditCardProcessor
var processor = PaymentFactory.Create(paymentType);
```

### Repository (abstrai dados)

```csharp
interface IRepository<T> where T : Entity
{
    Task<T> GetByIdAsync(int id);
    Task AddAsync(T entity);
    Task SaveChangesAsync();
}

class UserRepository : IRepository<User>
{
    private readonly DbContext _db;
    
    public async Task<User> GetByIdAsync(int id) => await _db.Users.FindAsync(id);
    public async Task AddAsync(User u) { _db.Users.Add(u); }
    public async Task SaveChangesAsync() => await _db.SaveChangesAsync();
}
```

### Observer (event-driven)

```csharp
class UserService
{
    public event EventHandler<UserCreatedEventArgs> UserCreated;
    
    public void CreateUser(User user)
    {
        UserCreated?.Invoke(this, new UserCreatedEventArgs(user));
    }
}

// Subscrever
var service = new UserService();
service.UserCreated += (s, e) => SendWelcomeEmail(e.User);
```

### Decorator (adicionar comportamento)

```csharp
interface IDataRepository { Task<User> GetAsync(int id); }

class LoggingDecorator : IDataRepository
{
    private readonly IDataRepository _inner;
    
    public async Task<User> GetAsync(int id)
    {
        _logger.Log($"Getting user {id}");
        return await _inner.GetAsync(id);
    }
}

// Uso
IDataRepository repo = new Repository();
repo = new LoggingDecorator(repo); // Adiciona logging
var user = await repo.GetAsync(1);
```

## Na prática

### Combining patterns

```csharp
// Factory + Strategy
var processor = PaymentFactory.Create(type);
var strategy = new PricingStrategyFactory().Create(userTier);

// Repository + Observer
var repo = new UserRepository();
repo.UserCreated += SendWelcomeEmail;
await repo.AddAsync(user);
```

## Armadilhas comuns

❌ **Usar padrão pra tudo** → Só quando resolve real problem

❌ **Overengineering** → Design Pattern não é pré-requisito

❌ **Padrões desusados** → Preferir simples sempre

## Referências

- [Gang of Four](https://www.oodesign.com/)
- [Refactoring Guru](https://refactoring.guru/design-patterns)
- [Microsoft — Design Patterns](https://docs.microsoft.com/en-us/dotnet/architecture/)
