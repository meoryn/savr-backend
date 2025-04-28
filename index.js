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

      const session = data.session
      const jwt = session?.access_token
    
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


app.post("/transactions", async (req, res) => {
  const {user_id, account_id, category_id, amount, type } = req.body;
  
  const refreshToken = req.headers["x-refresh-token"];


  // Token auslesen
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })

  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token" })


  
  const { data, error } = await supabase
  .from('transaction')
  .insert([
    {
      user_id: user_id,
      account_id: account_id,      
      category_id: category_id,
      amount: amount,
      type: type
    },
  ])

  console.log(data)
  if (error) {
    console.error("Insert-Error:", error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201);
  res.send("Success");
});

app.listen(port, () => {
  console.log(` Server running at port ${port}`);
});