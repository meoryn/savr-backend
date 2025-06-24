import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();


router.get('/balance', async (req, res) => {

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


export default router;