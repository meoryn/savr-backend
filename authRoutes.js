import express from 'express';
import { supabase } from './supabaseClient.js';
import { userMap } from './AccountIDHandler.js';
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    return res.status(401).json({ error: error.message });
  }



  const { data: accountData, error: accountError } = await supabase
    .from("account")
    .select("account_id")

  userMap.set(data.user.id, accountData[0].account_id);

  if (accountError) {
    console.log("Failed to find the right account_id in account table: " + accountError);
  }
  res.json({ user: data.user, session: data.session });
});


router.post("/register", async (req, res) => {
  const { email, password, id } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const { data: transactionInsertData, error: transactionInsertError } = await supabase
    .from('account')
    .insert([
      { user_id: data.user.id, account_name: data.user.email },
    ])
    .select()

  if (transactionInsertError) {
    console.log("Error inserting transaction" + transactionInsertError);
  }

  const { data: accountData, error: accountError } = await supabase
    .from("account")
    .select("account_id")

  userMap.set(data.user.id, accountData[0].account_id);


  if (accountError) {
    console.log("Failed to find the right account_id in account table: " + accountError);
  }

  res.json({ user: data.user, session: data.session });

})

export default router;