const dotnev = require('dotenv').config();
const express = require('express');
const {groupColumnsBySchemaAndTable,pool} = require('./Controller');
const {main} = require('./GeminiAPI');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())


app.post('/chat',async (req,res)=>{
    const question = req.body.question;
    const schema = await groupColumnsBySchemaAndTable();
    const response = await main(question,JSON.stringify(schema));
    if(!response){
        return res.status(500).json({
            message: "Server Busy! "
        })
    }
    const text=/```sql\n([\s\S]*?)\n```/
    const match = response.match(text);
    if (match) {
        const sqlQuery = match[1].trim();
        console.log(sqlQuery);
        pool.query(sqlQuery)
            .then((result) => {
                res.json({
                    data: result.rows,
                });
            })
            .catch((error) => {
                console.error("Error executing query", error);
                res.status(500).json({
                    status: "error",
                    message: "Error executing query",
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