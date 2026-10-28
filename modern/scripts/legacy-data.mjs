import { readFile } from "node:fs/promises";

// This parser reads literal SQL/PHP data; it never executes either input.
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

export function parsePhpArray(source, variable) {
  let index = source.indexOf(`$${variable}`);
  if (index < 0) throw new Error(`Missing PHP data variable ${variable}.`);
  index = source.indexOf("=", index) + 1;
  function skip() {
    while (index < source.length) {
      if (/\s/.test(source[index])) index++;
      else if (source.slice(index, index + 2) === "//") {
        const end = source.indexOf("\n", index);
        index = end < 0 ? source.length : end + 1;
      } else break;
    }
  }
  function value() {
    skip();
    if (source[index] === "[") return array();
    if (source[index] === "'" || source[index] === '"') {
      const result = readQuoted(source, index);
      index = result.end;
      return result.value;
    }
    if (source.slice(index, index + 8) === "base_url") {
      index += 8;
      skip();
      if (source[index++] !== "(") throw new Error("Invalid base_url literal.");
      const path = value();
      skip();
      if (source[index++] !== ")")
        throw new Error("Only literal base_url paths are supported.");
      return `/${path.replace(/^\/+/, "")}`;
    }
    throw new Error(`Unsupported PHP data literal at offset ${index}.`);
  }
  function array() {
    index++;
    const values = [];
    const object = {};
    let keyed = false;
    while (index < source.length) {
      skip();
      if (source[index] === "]") {
        index++;
        return keyed ? object : values;
      }
      const first = value();
      skip();
      if (source.slice(index, index + 2) === "=>") {
        keyed = true;
        index += 2;
        object[first] = value();
      } else values.push(first);
      skip();
      if (source[index] === ",") index++;
      else if (source[index] !== "]")
        throw new Error(`Invalid PHP array at offset ${index}.`);
    }
    throw new Error("Unterminated PHP array.");
  }
  return value();
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
