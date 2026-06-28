---
title: Polymorphism em C#
description: Virtual dispatch, interfaces e pattern matching — comportamento diferente, interface uniforme
emoji: 🔷
tags: [csharp, dotnet, design]
---

## Introdução

**Polimorfismo** permite chamar um método com a mesma interface, mas comportamentos diferentes dependendo do tipo. `Animal.Speak()` pode ser um cachorro latindo ou um gato miando.

**Em C# há 3 formas:** virtual dispatch (classes), interfaces (contrato) e pattern matching (estrutura). Cada uma resolve problemas diferentes.

## Conceitos principais

### Virtual dispatch

```csharp
class Animal { public virtual void Speak() { } }
class Dog : Animal { public override void Speak() => Console.WriteLine("Woof!"); }
class Cat : Animal { public override void Speak() => Console.WriteLine("Meow!"); }

// Polimorfismo
Animal animal = new Dog();
animal.Speak(); // Woof! (chamada dinâmica)
```

**Virtual** = decisão de qual método chamar é em **runtime**, baseado no tipo real do objeto.

### Interfaces

```csharp
interface IPaymentProcessor
{
    Task<bool> ProcessAsync(Payment payment);
}

class CreditCardProcessor : IPaymentProcessor
{
    public async Task<bool> ProcessAsync(Payment payment)
        => await _gateway.ChargeAsync(payment.Card, payment.Amount);
}

class PayPalProcessor : IPaymentProcessor
{
    public async Task<bool> ProcessAsync(Payment payment)
        => await _paypal.SendAsync(payment.Email, payment.Amount);
}

// Uso
IPaymentProcessor processor = GetProcessorForPayment(payment);
bool success = await processor.ProcessAsync(payment);
```

### Pattern matching

```csharp
public string Describe(object obj) => obj switch
{
    Dog d => $"Dog: {d.Name}",
    Cat c => $"Cat: {c.Name}",
    Bird b => $"Bird: {b.Name}",
    _ => "Unknown"
};

// Com condições (guard)
public int GetDiscount(Customer c) => c switch
{
    { Status: "VIP", OrderCount: > 10 } => 25,
    { Status: "VIP" } => 15,
    { Status: "Premium" } => 10,
    _ => 0
};
```

## Na prática

### Strategy pattern com interfaces

```csharp
interface IPricingStrategy
{
    decimal CalculatePrice(decimal basePrice);
}

class RegularPricing : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice) => basePrice;
}

class BlackFridayPricing : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice) => basePrice * 0.5m;
}

class VIPPricing : IPricingStrategy
{
    public decimal CalculatePrice(decimal basePrice) => basePrice * 0.7m;
}

// Uso
public class ShoppingCart
{
    private IPricingStrategy _strategy;

    public ShoppingCart(IPricingStrategy strategy)
        => _strategy = strategy;

    public decimal GetTotal(decimal basePrice)
        => _strategy.CalculatePrice(basePrice);
}

// Runtime
var pricing = GetPricingFor(user);
var cart = new ShoppingCart(pricing);
var total = cart.GetTotal(100);
```

### Virtual dispatch em cadeia

```csharp
abstract class PaymentMethod
{
    public abstract void Validate();
    public abstract void Charge(decimal amount);
}

class CreditCard : PaymentMethod
{
    public override void Validate() => CheckCardNumber();
    public override void Charge(decimal amount) => ChargeCard(amount);
}

class DebitCard : PaymentMethod
{
    public override void Validate() => CheckBalance();
    public override void Charge(decimal amount) => DebitAccount(amount);
}

// Cliente do código
public void ProcessPayment(PaymentMethod method, decimal amount)
{
    method.Validate();      // ← Virtual dispatch
    method.Charge(amount);  // ← Virtual dispatch
}
```

## Armadilhas comuns

❌ **Abusar de virtual** → Difícil debugar, overhead de performance

❌ **Misturar padrão com business logic** → Use padrão puro

❌ **Não respeitar contrato da interface** → Lisbkov Substitution Principle

❌ **Herança profunda (>3 níveis)** → Preferir composição

## Referências

- [MSDN — Polymorphism](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/polymorphism)
- [Design Patterns — Strategy](https://refactoring.guru/design-patterns/strategy)
- [Pattern Matching Guide](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching)

## Ver também

- [Interfaces vs Classes Abstratas](./interfaces-vs-abstract.md)
- [Design Patterns](../arquitetura/design-patterns.md)
- [Dependency Injection](../arquitetura/dependency-injection.md)
