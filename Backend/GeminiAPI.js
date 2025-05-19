import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

async function main(question, schema) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
      You are an expert SQL assistant.
      I will provide you with the schema of a PostgreSQL database and a question about the data.
      Your task is to analyze the schema and generate a correct, efficient SQL query that answers the question.
      Instructions:
      1. Output only the SQL query inside a code block. Do not include explanations or additional text.
      2. Use standard PostgreSQL syntax.
      3. All string comparisons must be case-insensitive: use ILIKE for matching text values, or LOWER(column_name) = 'value'.
      4. Do not include any sensitive data (e.g., passwords, API keys) in queries or outputs.
      5. When querying the users table, include only the user_id (employee ID) column if specifically requested. Otherwise, display the employee’s full name (concatenated first and last name, with a space) and use the alias "Employee Name". Never include both unless both are requested.
      6. Do not include created_at, updated_at, or deleted_at columns unless explicitly requested.
      7. For boolean fields, output "yes" if true and "no" if false, using SQL CASE statements as needed.
      8. When asked about the project an employee is working on, display the project name (not the project ID), unless the project ID is specifically requested.
      9. For all output fields, use human-friendly, properly capitalized aliases (e.g., reporting_manager becomes "Reporting Manager"). Do not output raw field names, underscores, or technical labels.
      10. Use primary and foreign key relationships for all joins between tables.
      11. Use table aliases for readability.
      12. Only select necessary columns to answer the question.
      13. If the user asks to view, describe, or access the schema or structure of the database, respond with:“You are not authorized to view the database schema.” Do not reveal or describe any schema details.
      Here is the schema: ${schema}
      Here is the question: ${question}
      `,
    });
    return response.text;
  } catch (error) {
    throw new Error("Server Busy!");
  }
}

export { main };
