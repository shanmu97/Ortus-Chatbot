const dotnev = require('dotenv').config();
const express = require('express');
const {groupColumnsBySchemaAndTable,pool,groupsColumnsBySchemaAndTable} = require('./Controller');
const {main} = require('./GeminiAPI');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())

app.post('/',async (req,res)=>{
    const question = req.body.question;
    const schema = await groupsColumnsBySchemaAndTable();
    const response = await main(question,JSON.stringify(schema));
    const text=/```sql\n([\s\S]*?)\n```/
    const match = response.match(text);
    if (match) {
        const sqlQuery = match[1].trim();
        console.log(sqlQuery);
        pool.query(sqlQuery)
            .then((result) => {
                if(result.rowCount === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "No data found!",
                    });
                }
                res.json({
                    data: result.rows,
                });
            })
            .catch((error) => {
                console.error("Error executing query", error);
                res.status(500).json({
                    status: "error",
                    message: "Server Busy!",
                });
            });
      } else {
        console.log("No match found.");
      }
}
)

app.post('/chat',async (req,res)=>{
    const question = req.body.question;
    const schema = await groupColumnsBySchemaAndTable();
    const response = await main(question,JSON.stringify(schema));
    
    const text=/```sql\n([\s\S]*?)\n```/
    const match = response.match(text);
    if (match) {
        const sqlQuery = match[1].trim();
        console.log(sqlQuery);
        pool.query(sqlQuery)
            .then((result) => {
                if(result.rowCount === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "No data found!",
                    });
                }
                res.json({
                    data: result.rows,
                });
            })
            .catch((error) => {
                console.error("Error executing query", error);
                res.status(500).json({
                    status: "error",
                    message: "Server Busy!",
                });
            });
      } else {
        console.log("No match found.");
      }
}
)

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}
)