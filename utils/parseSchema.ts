const tablesRegex = /create table\s+(.+)\s*\(\s+((?:\s|\(.+\)|[^\)])+)/gim;
const columnRegex = /^([^\s]+).+(int|integer|text|varchar).*(?:references\s+([^\(]+)\((.+)\))?/i;

export interface ColumnInfo {
  name: string;
  dataType: string;
  ref?: {
    tableName: string;
    colName: string;
  };
}

export interface Table {
  name: string;
  columns: ColumnInfo[];
  deps: string[];
}

export const parseSchema = (stringSchema: string) => {
  let m;

  const tables: Table[] = [];

  while ((m = tablesRegex.exec(stringSchema)) !== null) {
    if (m.index === tablesRegex.lastIndex) {
      tablesRegex.lastIndex++;
    }

    let tableName = "";
    let body = "";

    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        tableName = match.trim();
      }
      if (groupIndex === 2) {
        body = match;
      }
    });

    const columns: ColumnInfo[] = [];
    const deps: string[] = [];
    body.split(",").forEach(s => {
      s = s.trim();
      const ls = s.toLowerCase();
      if (
        ls.startsWith("unique(") ||
        ls.startsWith("primary key") ||
        ls.startsWith("constraint ")
      ) {
        return;
      }

      const columnInfo: ColumnInfo = { name: "", dataType: "" };
      let m2;
      if ((m2 = columnRegex.exec(s)) !== null) {
        m2.forEach((match, groupIndex) => {
          if (groupIndex === 1 && match) {
            columnInfo.name = match;
          } else if (groupIndex === 2 && match) {
            columnInfo.dataType = match.toLowerCase();
          } else if (groupIndex === 3 && match) {
            columnInfo.ref = { colName: "", tableName: match };
            deps.push(match);
          } else if (groupIndex === 4 && match) {
            columnInfo.ref!.colName = match;
          }
        });
      }

      if (columnInfo.name && columnInfo.dataType) {
        columns.push(columnInfo);
      }
    });

    if (columns.length) {
      tables.push({ name: tableName, columns, deps });
    }
  }

  return tables;
};
