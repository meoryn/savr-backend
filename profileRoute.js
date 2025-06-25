import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();


router.post("/edit_profile", async (req, res) => {
    const { user_id, username, full_name} = req.body;

    const refreshToken = req.headers["x-refresh-token"];

    // Token auslesen
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { data: userData, error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })


    const { data: updateData, error: updateError } = await supabase //Neuer Eintrag in Transactions table
        .from("profile")
        .update({
            username: username,
            full_name: full_name,
        })
        .eq("user_id", user_id)
        .select();

    if (updateError) {
        console.log(updateError);
    }



    res.status(201);
    res.send("Success");
});

router.post("/profile", async (req, res) => {
    const { user_id} = req.body;

    const refreshToken = req.headers["x-refresh-token"];

    // Token auslesen
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { data: userData, error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })


    const { data: selectData, error: selectError } = await supabase //Neuer Eintrag in Transactions table
        .from("profile")
        .select("username, full_name")
        .eq("user_id", user_id);

    if (selectError) {
        console.log(selectError);
    } else {
    res.json(selectData[0]);

    }

});

export default router;