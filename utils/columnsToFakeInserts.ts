import { ColumnInfo, Table } from "./parseSchema";
import faker from "faker";

const colToFakeValue = (c: ColumnInfo) => {
  if (c.dataType === "int" || c.dataType === "integer") {
    return Math.floor(Math.random() * 100) + 1;
  }

  if (c.dataType === "text" || c.dataType === "varchar") {
    let s = faker.lorem.word();
    if (c.name.includes("first_name")) {
      s = faker.name.firstName();
    } else if (c.name.includes("last_name")) {
      s = faker.name.lastName();
    } else if (c.name.includes("email")) {
      s = faker.internet.email();
    } else if (c.name.includes("body")) {
      s = faker.lorem.paragraphs();
    } else if (c.name.includes("message")) {
      s = faker.lorem.sentence();
    } else if (c.name.includes("title")) {
      s = faker.company.bs();
    }

    return `'${s}'`;
  }

  throw new Error("unknown dataType: " + c.dataType);
};

export const columnsToFakeInserts = (table: Table, seed: number) => {
  if (!Number.isNaN(seed)) {
    faker.seed(seed);
  }

  const inserts: string[] = [];

  for (let i = 0; i < 100; i++) {
    inserts.push(
      `insert into ${table.name} (${table.columns
        .map(c => c.name)
        .join(",")}) values (${table.columns.map(colToFakeValue).join(",")});`
    );
  }

  return inserts;
};
