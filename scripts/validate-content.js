#!/usr/bin/env node

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DOCS_DIR = path.join(__dirname, "../src/content/docs");
const REQUIRED_SECTIONS = ["Introdução", "Conceitos principais", "Na prática"];

let errors = [];
let warnings = [];

// Validar arquivo individual
function validateFile(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const content = fs.readFileSync(filePath, "utf-8");

  // Extrair frontmatter (tolerante a CRLF do Windows)
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    errors.push(`${relativePath}: Frontmatter ausente`);
    return;
  }

  try {
    const frontmatter = yaml.load(frontmatterMatch[1]);

    // Validar campos obrigatórios
    if (!frontmatter.title) {
      errors.push(`${relativePath}: title obrigatório no frontmatter`);
    }
    if (!frontmatter.description) {
      errors.push(`${relativePath}: description obrigatório no frontmatter`);
    }

    // Validar tamanho da descrição
    if (frontmatter.description && frontmatter.description.length > 160) {
      warnings.push(
        `${relativePath}: description muito longa (${frontmatter.description.length}/160 chars)`
      );
    }

    // Validar título em sentence case (primeira letra maiúscula)
    if (frontmatter.title && !/^[A-Z]/.test(frontmatter.title)) {
      errors.push(`${relativePath}: title deve começar com maiúscula`);
    }
  } catch (e) {
    errors.push(`${relativePath}: Frontmatter YAML inválido: ${e.message}`);
    return;
  }

  // Validar nome do arquivo (kebab-case, sem espaços) — cobre .md e .mdx
  const basename = path.basename(filePath).replace(/\.mdx?$/, "");
  if (!/^[a-z0-9\-]+$/.test(basename)) {
    errors.push(`${relativePath}: Arquivo deve ser kebab-case (abc-def.md)`);
  }

  // Seções recomendadas (aviso, não erro — conteúdo de referência pode variar)
  const bodyContent = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  REQUIRED_SECTIONS.forEach((section) => {
    if (!bodyContent.includes(`## ${section}`)) {
      warnings.push(`${relativePath}: Seção recomendada "## ${section}" ausente`);
    }
  });

  // Validar que tem código de exemplo
  if (!bodyContent.includes("```")) {
    warnings.push(`${relativePath}: Não tem exemplo de código`);
  }
}

// Percorrer todos os arquivos .md e .mdx
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    const isContent = file.endsWith(".md") || file.endsWith(".mdx");
    const isIndex = file === "index.md" || file === "index.mdx";

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (isContent && !isIndex) {
      validateFile(filePath);
    }
  });
}

// Executar validação
console.log("🔍 Validando conteúdo...\n");
walkDir(DOCS_DIR);

// Imprimir resultados
if (errors.length > 0) {
  console.log("❌ ERROS:");
  errors.forEach((err) => console.log(`   ${err}`));
  console.log();
}

if (warnings.length > 0) {
  console.log("⚠️  AVISOS:");
  warnings.forEach((warn) => console.log(`   ${warn}`));
  console.log();
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ Todos os artigos estão válidos!");
}

// Exit com erro se houver erros
process.exit(errors.length > 0 ? 1 : 0);
