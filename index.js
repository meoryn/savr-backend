import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

import express from 'express';

import cors from 'cors';
const app = express()
const port = 4000

const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabasekey;


const supabase = createClient(supabaseUrl, supabaseKey);

const allowedOrigins = [
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());



app.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
  const { email, password, id } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const { dataInsert, errorInsert } = await supabase
    .from('account')
    .insert([
      { user_id: data.user.id, account_name: data.user.email },
    ])
    .select()


  console.log(data.user.id);
  res.json({ user: data.user, session: data.session });

})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post("/transactions", async (req, res) => {
  const { user_id, account_id, category_id, amount, type } = req.body;

  const refreshToken = req.headers["x-refresh-token"];

  // Token auslesen
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })

  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token" })



  const { data, error } = await supabase //Neuer Eintrag in Transactions table
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

  let oldbalance;
  try {     //Aktuelle Balance holen
    let { data: balance, error } = await supabase
      .from('account')
      .select('balance')
      .eq('account_id', account_id);

    oldbalance = balance[0].balance;

  } catch (error) {
    console.error('Fehler beim Abrufen der Balance:', error.message);
    return null;
  }

  try {     //Balance updaten
    let newBalance = oldbalance;
    if (type == "expense") {
      newBalance -= amount;
    } else {
      newBalance += amount;
    }

    let { data: balance, error } = await supabase
      .from('account')
      .update({ balance: newBalance })
      .eq('account_id', account_id);


  } catch (error) {
    console.error('Fehler beim Updaten der Balance:', error.message);
    return null;
  }



  console.log(data)
  if (error) {
    console.error("Insert-Error:", error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201);
  res.send("Success");
});


app.get('/testing', async (req, res) => {

  const refreshToken = req.headers["x-refresh-token"];
  console.log(req);

  // Token auslesen
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })

  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token" })

  try {     //Aktuelle Balance holen
    let { data: balance, error } = await supabase
      .from('account')
      .select('balance')
      .eq('account_id', account_id);

    balance = balance[0].balance;

    res.send(balance);

  } catch (error) {
    console.error('Fehler beim Abrufen der Balance:', error.message);
    return null;
  }


})


app.get('/balance', async (req, res) => {

  const account_id = req.body.account_id;

  console.log(account_id);
  const refreshToken = req.headers["x-refresh-token"];

  // Token auslesen
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })

  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token" })

  try {     //Aktuelle Balance holen
    let { data: balance, error } = await supabase
      .from('account')
      .select('balance')
      .eq('account_id', account_id);

    balance = balance[0].balance;

    res.send(balance);

  } catch (error) {
    console.error('Fehler beim Abrufen der Balance:', error.message);
    return null;
  }




})



app.post('/monthly_limit', async (req, res) => {

  const { account_id, category_id, maximum } = req.body;

  console.log(account_id);
  console.log(category_id);
  console.log(maximum);

  const refreshToken = req.headers["x-refresh-token"];
  // Token auslesen
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })

  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token" })

  try {     //Monatliches Maximum in monthly_limit eintragen

    const { data, error } = await supabase
      .from('monthly_limit')
      .insert([
        {
          account_id: account_id,
          category_id: category_id,
          maximum: maximum
        },
      ])

    res.status(201);
    res.send("Success");
  } catch (error) {
    console.error('Fehler beim Abrufen der Balance:', error.message);
    return null;
  }




})


app.listen(port, () => {
  console.log(` Server running at port ${port}`);
});
