import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();


router.post('/balance', async (req, res) => {

  const user_id = req.body.user_id;

  const refreshToken = req.headers["x-refresh-token"];


  // Token auslesen
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Missing token" })
  // Session setzen
  const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
  if (sessErr) return res.status(401).json({ error: "Invalid token" })


  //Aktuelle Balance holen
  let { data: balance, error } = await supabase
    .from('account')
    .select('balance')
    .eq('user_id', user_id);

  balance = balance[0].balance;

    res.set("new-x-refresh-token", userData.session.refresh_token);
    res.set("jwt", userData.session.access_token);
  if (error) {
    console.error('Fehler beim Abrufen der Balance:', error.message);
    res.send(error);
  }
  res.send(balance);


  return null;





})


export default router;