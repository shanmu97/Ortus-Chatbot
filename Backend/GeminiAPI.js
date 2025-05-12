import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

async function main(question,schema) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
      You are an expert SQL assistant.
      I will provide you with the schema of a PostgreSQL database and a question about the data.
      Your task is to analyze the schema and generate a correct, efficient SQL query that answers the question.
      Please use standard PostgreSQL syntax and output only the SQL query inside a code block.
      Generate the SQL query without any explanation or additional text.
      Here is the schema: ${schema}
      Here is the question: ${question}
      When generating SQL queries based on my questions, always ensure that all string comparisons are case-insensitive.
      For PostgreSQL, use ILIKE instead of = for matching text values, or use LOWER(column_name) = 'value'.
      Do not use case-sensitive comparisons.
      Do not include any sensitive data such as passwords or API keys in the query or output.
      When generating a SQL query or displaying search results from the users table, only include the user_id (employee ID) column if the user specifically requests it. 
      If not explicitly requested, display the employee’s name instead. Never include both user_id and name together unless both are specifically requested.
      If not explicitly requested, donot display the created_at, updated_at, deleted_at data in the output.
      Whenever a response involves a boolean value, output "yes" if the value is true and "no" if the value is false. Do not output true or false directly; always use "yes" or "no".
      When asked about the project an employee is working on, always display the project name instead of the project ID. 
      Do not include or show the project ID in the output unless it is specifically requested by the user.
      When displaying a person’s name, show the full name as a single string in the format with a space between first and last name and add title "Employee Name" before the answer.
      When displaying answers that include a field name or title before the value, always convert the field name to a human-friendly, properly capitalized format with spaces (e.g., reporting_manager becomes Reporting Manager). 
      Do not display raw field names, underscores, or technical labels.
      Apply this formatting to all field names or titles shown in the output.
      `,
    });
    return response.text;

  } catch (error) {
    throw new Error("Server Busy!")
  }
  
}

export {main}