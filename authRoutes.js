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
    return res.json({ error: error.message });
  }

  //account_id zur userMap hinzufügen
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
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) {
    return res.json({ error: error.message });
  }

  //account_id in die account table einfügen
  const { data: accountInsertData, error: accountInsertError } = await supabase
    .from('account')
    .insert([
      { user_id: data.user.id, account_name: data.user.email },
    ])
    .select()

  if (accountInsertError) {
    console.log("Error inserting transaction" + accountInsertError);
  }

  //user_id in die profile table einfügen
  const { data: profileInsertData, error: profileInsertError } = await supabase
    .from("profile")
    .insert([
      {
        user_id: data.user.id,
        username: email
      },
    ])
    .select()

  if (profileInsertError) {
    console.log(profileInsertError);
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

router.post('/change_password', async (req, res) => {
  const new_password = req.body.new_password;
  const refreshToken = req.headers["x-refresh-token"];
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })

  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })


  const { data: changeData, error: changeError } = await supabase
    .auth
    .updateUser({ password: new_password });

  if (changeError) {
    res.json(changeError);
  } else {
    res.json(changeData);
  }

  res.set("new-x-refresh-token", userData.session.refresh_token);
  res.set("jwt", userData.session.access_token);

})
export default router;