import React from "react";
import Layout from "../../../components/Layout";
import { NextPage } from "next";
import { generateInsertStatements } from "../../../utils/generateInsertStatements";
import { isBrowser } from "../../../utils/isBrowser";
import { withRouter } from "next/router";

const DataGenerator: NextPage = ({ url }: any) => {
  const { schema, seed } = url.query;
  if (!isBrowser()) {
    return null;
  }

  const statements = generateInsertStatements(schema, seed);

  return (
    <Layout title="Random Insert Statements">
      <pre
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap"
        }}
      >
        {Array.isArray(statements) ? statements.join("\n") : statements}
      </pre>
    </Layout>
  );
};

export default withRouter(DataGenerator);
