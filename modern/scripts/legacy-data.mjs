import { readFile } from "node:fs/promises";

// This parser reads literal SQL data; it never executes the input.
function readQuoted(source, start, sql = false) {
  const quote = source[start];
  let value = "";
  let index = start + 1;
  while (index < source.length) {
    const character = source[index++];
    if (character === "\\") {
      const next = source[index++];
      if (sql)
        value +=
          { n: "\n", r: "\r", t: "\t", 0: "\0", b: "\b", Z: "\x1a" }[next] ??
          next;
      else value += next === "'" || next === "\\" ? next : `\\${next}`;
    } else if (character === quote) {
      if (sql && source[index] === quote) {
        value += quote;
        index++;
      } else return { value, end: index };
    } else value += character;
  }
  throw new Error("Unterminated quoted literal in legacy source.");
}

export function parseSqlTable(sql, table) {
  if (!/^[a-z_]+$/.test(table)) throw new Error("Invalid table name.");
  const rows = [];
  const statement = new RegExp(
    `INSERT\\s+INTO\\s+\\\`${table}\\\`\\s*\\(([^)]+)\\)\\s*VALUES\\s*`,
    "gi",
  );
  let match;
  while ((match = statement.exec(sql))) {
    const columns = [...match[1].matchAll(/`([^`]+)`/g)].map(
      (column) => column[1],
    );
    let index = statement.lastIndex;
    while (index < sql.length) {
      while (/[\s,]/.test(sql[index] || "")) index++;
      if (sql[index] === ";") break;
      if (sql[index++] !== "(")
        throw new Error(`Unsupported ${table} INSERT syntax.`);
      const values = [];
      while (index < sql.length) {
        while (/\s/.test(sql[index] || "")) index++;
        if (sql[index] === "'" || sql[index] === '"') {
          const literal = readQuoted(sql, index, true);
          values.push(literal.value);
          index = literal.end;
        } else {
          const start = index;
          while (index < sql.length && sql[index] !== "," && sql[index] !== ")")
            index++;
          const literal = sql.slice(start, index).trim();
          if (/^null$/i.test(literal)) values.push(null);
          else if (/^-?\d+(?:\.\d+)?$/.test(literal))
            values.push(Number(literal));
          else throw new Error(`Unsupported literal in ${table} INSERT.`);
        }
        while (/\s/.test(sql[index] || "")) index++;
        if (sql[index] === ",") {
          index++;
          continue;
        }
        if (sql[index++] !== ")") throw new Error(`Invalid ${table} row.`);
        break;
      }
      if (values.length !== columns.length)
        throw new Error(`Column mismatch in ${table}.`);
      rows.push(
        Object.fromEntries(
          columns.map((column, number) => [column, values[number]]),
        ),
      );
    }
    statement.lastIndex = index + 1;
  }
  return rows;
}

export async function readLegacyExport(input) {
  const source = await readFile(input, "utf8");
  if (input.toLowerCase().endsWith(".json")) {
    const data = JSON.parse(source);
    if (!Array.isArray(data.products) || !Array.isArray(data.users)) {
      throw new Error("JSON export must contain products and users arrays.");
    }
    return data;
  }
  const products = parseSqlTable(source, "products");
  const users = parseSqlTable(source, "users");
  if (!products.length) throw new Error("No products found in the SQL export.");
  return { products, users };
}

export function publicProduct(row) {
  const product = {
    id: Number(row.id),
    name: String(row.name || ""),
    price: Number(row.price),
    description: String(row.description || ""),
    image: String(row.image || "default.png"),
    category: String(row.category || "Others"),
    stock: Number(row.stock),
  };
  if (
    !Number.isSafeInteger(product.id) ||
    product.id < 1 ||
    product.id > 2147483647 ||
    !product.name.trim() ||
    product.name.length > 200 ||
    !Number.isFinite(product.price) ||
    product.price < 0 ||
    !Number.isSafeInteger(product.stock) ||
    product.stock < 0
  ) {
    throw new Error(
      "Invalid legacy product record; export requires correction before migration.",
    );
  }
  if (
    !/^https:\/\//.test(product.image) &&
    (product.image.includes("..") ||
      product.image.includes("\\") ||
      product.image.startsWith("/"))
  ) {
    throw new Error(`Invalid product image path for product ${product.id}.`);
  }
  return product;
}
