import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();



router.get('/monthlyReport', async (req, res) => {
    const account_id = req.body.account_id;
    const refreshToken = req.headers["x-refresh-token"];
    console.log(account_id);

    // Token auslesen
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

    const { data, error } = await supabase
    .from("monthly_report")
    .select("sum, type, transaction_date, category_name")
    .eq("account_id", account_id);

    if(error) {
        res.json(error);
    }
    res.json(data);

})


export default router;