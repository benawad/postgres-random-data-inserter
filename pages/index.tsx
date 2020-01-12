import * as React from "react";
import Layout from "../components/Layout";
import { NextPage } from "next";
import Router from "next/router";
import { parseSchema } from "../utils/parseSchema";

const IndexPage: NextPage = () => {
  const [text, setText] = React.useState();
  const [error, setError] = React.useState("");

  return (
    <Layout title="Postgres Random Data Inserter">
      <div style={{ width: 400, maxWidth: "100%", margin: "auto" }}>
        <h1>Generate Fake Data for your PostgreSQL Database</h1>
        <p>
          <a href="/tutorial">click here for tutorial data</a>
        </p>
        <div>Supported data types:</div>
        <ul>
          <li>text</li>
          <li>int</li>
          <li>integer</li>
          <li>varchar (length ignored)</li>
          <li>
            <a href="https://github.com/benawad/postgres-random-data-inserter">
              add new data type
            </a>
          </li>
        </ul>
        <p>paste tables below.</p>
        <div>
          <textarea
            placeholder={`CREATE TABLE cinemas (
  id serial,
  name text,
  location text
);
CREATE TABLE distributors (
  did     integer,
  name    text,
  UNIQUE(name)
);
          `}
            style={{ width: "100%" }}
            rows={15}
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <button
          style={{ marginTop: "1em" }}
          onClick={() => {
            if (!text) {
              setError("empty...");
              return;
            }

            const parsedSchema = parseSchema(text);
            Router.push(
              "/data/[schema]/[seed]",
              `/data/${btoa(JSON.stringify(parsedSchema))}/${Math.floor(
                Math.random() * 10000
              )}`
            );
          }}
        >
          generate data
        </button>
        <span style={{ paddingLeft: "1em", color: "#bb0000" }}>{error}</span>

        <div style={{ marginTop: "10em" }}>
          used in <a href="#add-youtube-link">Ben Awad's PostgreSQL Tutorial</a>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
