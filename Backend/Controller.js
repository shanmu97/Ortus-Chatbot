const { Pool } = require("pg");
const {username,password,host,database,port} = require('./envsample')

const pool = new Pool({
  user:  "postgres",
  host: "localhost",
  database: "postgres",
  password: "lumiq123",
  port:5432,
});

const Schema = async () => {
  const schema = await pool.query(`
        SELECT table_schema, table_name, column_name, data_type
        FROM information_schema.columns
        ORDER BY table_schema, table_name, ordinal_position;
        `);
  return schema.rows
};
const FullSchema = async () => {
  const schema = await pool.query(`
        SELECT
    cols.table_schema,
    cols.table_name,
    cols.column_name,
    cols.data_type,
    -- Primary Key info
    CASE WHEN pk.column_name IS NOT NULL THEN 'YES' ELSE 'NO' END AS is_primary_key,
    -- Foreign Key info
    CASE WHEN fk.column_name IS NOT NULL THEN 'YES' ELSE 'NO' END AS is_foreign_key,
    fk.foreign_table_name AS referenced_table,
    fk.foreign_column_name AS referenced_column
FROM
    information_schema.columns AS cols
-- Join for Primary Key
LEFT JOIN (
    SELECT
        tc.table_schema,
        tc.table_name,
        kcu.column_name
    FROM
        information_schema.table_constraints AS tc
    JOIN
        information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE
        tc.constraint_type = 'PRIMARY KEY'
) AS pk
ON
    cols.table_schema = pk.table_schema
    AND cols.table_name = pk.table_name
    AND cols.column_name = pk.column_name
-- Join for Foreign Key
LEFT JOIN (
    SELECT
        kcu.table_schema,
        kcu.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM
        information_schema.table_constraints AS tc
    JOIN
        information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN
        information_schema.constraint_column_usage AS ccu
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
    WHERE
        tc.constraint_type = 'FOREIGN KEY'
) AS fk
ON
    cols.table_schema = fk.table_schema
    AND cols.table_name = fk.table_name
    AND cols.column_name = fk.column_name
ORDER BY
    cols.table_schema,
    cols.table_name,
    cols.ordinal_position;

        `);
  return schema.rows
};



async function groupColumnsBySchemaAndTable() {
  const schemaArray = await Schema();
  const grouped = {};
  schemaArray.forEach(({ table_schema, table_name, column_name, data_type }) => {
    if (!grouped[table_schema]) grouped[table_schema] = {};
    if (!grouped[table_schema][table_name]) grouped[table_schema][table_name] = [];
    grouped[table_schema][table_name].push({ column_name, data_type });
  });
  return grouped;
}

async function groupsColumnsBySchemaAndTable() {
  const schemaArray = await FullSchema();
  const grouped = {};

  schemaArray.forEach(
    ({
      table_schema,
      table_name,
      column_name,
      data_type,
      is_primary_key,
      is_foreign_key,
      referenced_table,
      referenced_column
    }) => {
      if (!grouped[table_schema]) grouped[table_schema] = {};
      if (!grouped[table_schema][table_name]) grouped[table_schema][table_name] = [];

      grouped[table_schema][table_name].push({
        column_name,
        data_type,
        is_primary_key,
        is_foreign_key,
        referenced_table,
        referenced_column
      });
    }
  );

  return grouped;
}



pool
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });

  module.exports={
    Schema,groupColumnsBySchemaAndTable,pool,FullSchema,groupsColumnsBySchemaAndTable
  }