require("dotenv").config(); 
const { createClient } = require("@supabase/supabase-js");

const express = require('express')
const app = express()
const port = 3000

const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabasekey;


const supabase = createClient(supabaseUrl, supabaseKey);
app.use(express.json());


app.post("/login", async (req, res) => {
    const {email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })  
    
      if (error) {
        return res.status(401).json({ error: error.message });
      }
    
      res.json({ user: data.user, session: data.session });

    });


app.post("/register", async (req, res) => {
    const {email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) {
        return res.status(401).json({ error: error.message });
      }
    
      res.json({ user: data.user, session: data.session });
    
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})