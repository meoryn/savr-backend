import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();



router.get('/logout', async (req, res) => {
    const refreshToken = req.headers["x-refresh-token"];

    // Token auslesen
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

const {error } = await supabase.auth.signOut();
console.log(error);
res.send("Success");

})


export default router;