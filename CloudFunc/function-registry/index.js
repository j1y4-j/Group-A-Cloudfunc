const express = require('express');
const { Pool } = require('pg');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));



const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'functions_db',
    port: 5433
});

app.get('/functions', async (req, res) => {
  try {
    const result = await pool.query('SELECT name,owner,image FROM functions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});
app.get('/function/:name',async (req,res) => {
  const functionName = req.params.name;
  try {
    const result = await pool.query('SELECT name,owner,image FROM functions WHERE name = $1', [functionName]);
    if(result.rows.length==0) {
      return res.status(404).send({message: `Function not found`});
    }
  res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Database error"});
  }


  
},)

app.post('/registerFunction', async (req, res) => {
  const { name, owner, image } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO functions (name, owner, image) VALUES ($1, $2, $3) RETURNING *',
      [name, owner, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// app.delete('/deleteFunction/:name', async (req,res) => {
//   try{
//       const nameToDelete = req.params.name;
//       console.log(`Deleting row where name is: ${nameToDelete}`);
//       const result = await pool.query(
//       'DELETE FROM functions WHERE name = $1', 
//       [nameToDelete]
//     );
//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: `Function '${nameToDelete}' not found.` });
//     }verify(token, JWT_SECRET)

//       res.status(200).send({message:`Row ${nameToDelete} deleted successfully `});

//   }
//   catch(err){
//     res.status(500).send({message: `Failed to delete ${nameToDelete}`});
//   }



  
// }
// )


app.listen(4000,()=>{
    console.log("Server Running on Port 4000");
});
