import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();



router.post('/monthly_limit', async (req, res) => {

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
export default router;