// @ts-check
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://bieltrue95.github.io",
  base: "/gb-kb",
  integrations: [
    // ⚠️ Mermaid deve vir ANTES do Starlight
    mermaid({
      theme: "dark",
      autoTheme: false,
    }),
    starlight({
      title: "GB Knowledge Base",
      description: "Dev .NET · AppSec · Arquitetura — por Gabriel",
      defaultLocale: "pt-BR",
      customCss: ["./src/styles/theme.css", "./src/styles/reading.css"],
      head: [
        {
          tag: "meta",
          attrs: {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-32x32.png",
            type: "image/svg+xml",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/gb-kb/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        },
        {
          tag: "link",
          attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: true,
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/bieltrue95",
        },
      ],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: "Início",
          items: [
            { label: "🏠 Início", link: "/" },
            { label: "👤 Sobre", link: "/about/" },
            {
              label: "❓ Perguntas de Entrevista",
              link: "/entrevistas/",
              badge: { text: "34+", variant: "note" },
            },
          ],
        },
        {
          label: "Padrões Distribuídos",
          items: [
            {
              label: "🌿 Strangler Fig",
              link: "/distribuidos/strangler-fig/",
              badge: { text: "3 fases", variant: "tip" },
            },
            {
              label: "🚦 Feature Flags",
              link: "/distribuidos/feature-flags/",
              badge: { text: "hash", variant: "caution" },
            },
            {
              label: "📬 Outbox Pattern",
              link: "/distribuidos/outbox/",
              badge: { text: "idempot.", variant: "success" },
            },
            {
              label: "🔄 Saga Pattern",
              link: "/distribuidos/saga/",
              badge: { text: "2 tipos", variant: "default" },
            },
            {
              label: "⚡ Resilience",
              link: "/distribuidos/resilience/",
              badge: { text: "polly", variant: "danger" },
            },
            {
              label: "🔍 Deferred Execution",
              link: "/distribuidos/deferred-execution/",
              badge: { text: "EF Core", variant: "note" },
            },
          ],
        },
        {
          label: "C# Fundamentals",
          items: [
            {
              label: "🔷 Polymorphism",
              link: "/csharp/polymorphism/",
              badge: { text: "virtual", variant: "note" },
            },
            {
              label: "📐 Interfaces vs Abstract",
              link: "/csharp/interfaces-vs-abstract/",
              badge: { text: "design", variant: "default" },
            },
            {
              label: "📦 Collections & Generics",
              link: "/csharp/collections-generics/",
              badge: { text: "Big-O", variant: "caution" },
            },
            {
              label: "🔒 Immutability",
              link: "/csharp/immutability/",
              badge: { text: "records", variant: "success" },
            },
            {
              label: "📡 Delegates & Events",
              link: "/csharp/delegates-events/",
              badge: { text: "Func/Action", variant: "tip" },
            },
          ],
        },
        {
          label: "Async & Performance",
          items: [
            {
              label: "🔗 LINQ & Deferred",
              link: "/async/linq/",
              badge: { text: "IQueryable", variant: "note" },
            },
            {
              label: "⏳ Async/Await",
              link: "/async/async-await/",
              badge: { text: "Task", variant: "default" },
            },
            {
              label: "🧵 Threading",
              link: "/async/threading/",
              badge: { text: "locks", variant: "caution" },
            },
            {
              label: "🧠 Memory & Span",
              link: "/async/memory-span/",
              badge: { text: "zero-alloc", variant: "success" },
            },
          ],
        },
        {
          label: "Architecture & Design",
          items: [
            {
              label: "💉 Dependency Injection",
              link: "/arquitetura/dependency-injection/",
              badge: { text: "lifetimes", variant: "tip" },
            },
            {
              label: "🏗️ SOLID Principles",
              link: "/dotnet/solid/",
              badge: { text: "5 princ.", variant: "note" },
            },
            {
              label: "🎨 Design Patterns",
              link: "/arquitetura/design-patterns/",
              badge: { text: "GoF", variant: "default" },
            },
            {
              label: "📖 CQRS & Event Sourcing",
              link: "/arquitetura/cqrs/",
              badge: { text: "MediatR", variant: "caution" },
            },
            { label: "🧩 Clean Architecture", link: "/dotnet/arquitetura/" },
            { label: "🔁 Unit of Work", link: "/dotnet/unit-of-work/" },
          ],
        },
        {
          label: "ASP.NET Core",
          items: [
            {
              label: "🌍 REST API Design",
              link: "/aspnet/rest-api/",
              badge: { text: "minimal", variant: "success" },
            },
            {
              label: "🔧 Middleware & Pipeline",
              link: "/aspnet/middleware/",
              badge: { text: "pipeline", variant: "note" },
            },
            {
              label: "🔐 Auth & Authorization",
              link: "/appsec/jwt-seguro/",
              badge: { text: "JWT", variant: "danger" },
            },
            {
              label: "🛡️ Security & OWASP",
              link: "/appsec/owasp-top10/",
              badge: { text: "OWASP", variant: "caution" },
            },
            {
              label: "💾 Caching",
              link: "/aspnet/caching/",
              badge: { text: "Redis", variant: "tip" },
            },
          ],
        },
        {
          label: "Data & EF Core",
          items: [
            {
              label: "🗄️ EF Core Basics",
              link: "/data/ef-core-basics/",
              badge: { text: "DbContext", variant: "note" },
            },
            {
              label: "📊 EF Core Advanced",
              link: "/dotnet/ef-core-performance/",
              badge: { text: "queries", variant: "default" },
            },
          ],
        },
        {
          label: "Testing & DevOps",
          items: [
            {
              label: "🧪 Testing & TDD",
              link: "/devops/testing/",
              badge: { text: "xUnit", variant: "tip" },
            },
            {
              label: "🐳 Docker & CI/CD",
              link: "/ferramentas/docker/",
              badge: { text: "Actions", variant: "success" },
            },
            {
              label: "⚙️ GitHub Actions",
              link: "/ferramentas/github-actions/",
            },
            {
              label: "☁️ Azure & Deploy",
              link: "/ferramentas/azure/",
              badge: { text: "SWA", variant: "note" },
            },
          ],
        },
        {
          label: "Messaging & Events",
          items: [
            {
              label: "📨 Messaging Patterns",
              link: "/messaging/messaging-patterns/",
              badge: { text: "pub/sub", variant: "default" },
            },
            {
              label: "🐇 RabbitMQ",
              link: "/messaging/rabbitmq/",
              badge: { text: "AMQP", variant: "caution" },
            },
          ],
        },
        {
          label: "Segurança & Redes",
          items: [
            {
              label: "🔓 Broken Access Control",
              link: "/appsec/broken-access-control/",
            },
            { label: "🧪 Burp Suite", link: "/appsec/burp-suite/" },
            { label: "🔎 SAST com Semgrep", link: "/appsec/sast-semgrep/" },
            { label: "🧨 Threat Modeling", link: "/appsec/threat-modeling/" },
            { label: "🧱 Security Headers", link: "/appsec/security-headers/" },
            { label: "🌐 Redes — Fundamentos", link: "/redes/fundamentos/" },
          ],
        },
        {
          label: "Certificações",
          items: [
            {
              label: "🎓 Google Cybersecurity Certificate",
              collapsed: false,
              items: [
                {
                  label: "📋 Curso 1 — Índice",
                  link: "/seguranca/google-cert/curso-1-fundamentos/",
                },
                {
                  label: "Módulo 1 — Introdução à segurança",
                  link: "/seguranca/google-cert/curso-1-fundamentos/modulo-1-introducao-a-seguranca-cibernetica/",
                  badge: { text: "22/23", variant: "success" },
                },
                {
                  label: "Módulo 2 — Evolução da segurança",
                  link: "/seguranca/google-cert/curso-1-fundamentos/modulo-2-a-evolucao-da-seguranca-cibernetica/",
                  badge: { text: "15/17", variant: "caution" },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
