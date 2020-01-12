import { columnsToFakeInserts } from "./columnsToFakeInserts";
import { Table } from "./parseSchema";

export const generateInsertStatements = (
  base64Schema: string,
  seed: string
) => {
  let seedNum = parseInt(seed);
  const stringSchema = atob(base64Schema);

  if (!stringSchema) {
    return "invalid data";
  }

  const tables = JSON.parse(stringSchema) as Table[];

  if (!tables.length) {
    return "could not find any tables with columns";
  }

  const statements = [];

  statements.push(
    `TRUNCATE TABLE ${tables.map(t => t.name).join(",")} RESTART IDENTITY;`
  );

  let deadlock = false;
  const depMap: Record<string, boolean> = {};
  const tablesDone: Record<string, boolean> = {};
  while (Object.keys(tablesDone).length < tables.length && !deadlock) {
    deadlock = true;
    for (const table of tables) {
      if (!table.deps.length || table.deps.every(d => d in depMap)) {
        deadlock = false;
        statements.push(...columnsToFakeInserts(table, seedNum));
        tablesDone[table.name] = true;
      }
    }
  }

  if (deadlock) {
    return "deadlock";
  }

  return statements;
};
