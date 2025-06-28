import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();



router.post('/recurringEntries', async (req, res) => {
    const { user_id, category_id, amount, day } = req.body;
    const refreshToken = req.headers["x-refresh-token"];
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })


    const { data, error } = await supabase
        .from("recurring_entry")
        .insert([
            {
                user_id: user_id,
                category_id: category_id,
                amount: amount,
                day: day
            },
        ])


        res.set("new-x-refresh-token", userData.session.refresh_token);
    res.set("jwt", userData.session.access_token);

    if (error) {
        res.json(error);
    } else {
        res.send("Success");
    }

})


export default router;