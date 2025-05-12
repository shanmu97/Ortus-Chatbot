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


pool
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });

  module.exports={
    Schema,groupColumnsBySchemaAndTable,pool
  }