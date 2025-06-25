import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();



router.post('/getMonthlyLimit', async (req, res) => {

    const { user_id, category_name } = req.body;

    const refreshToken = req.headers["x-refresh-token"];
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

    if (sessErr) {
        console.log(sessErr);
    }
    // Token auslesen


    //category_name auf category_id mappen

    const { data: categoryData, error: categoryError } = await supabase
        .from("category")
        .select("category_id")
        .eq("name", category_name);

    const category_id = categoryData[0].category_id;
    if (categoryError) {
        console.log("Fehler bei der Anfrage an category nach der passenden ID: " + errorData);
        res.json(categoryError);
    }

    const { data: checkData, error: errorData } = await supabase
        .from("monthly_limit")
        .select("maximum")
        .eq("user_id", user_id)
        .eq("category_id", category_id);

    if (errorData) {
        console.log("Fehler bei der Anfrage an monthly_limit nach dem Maximum: " + errorData);
        res.json(errorData);
    }
    if (checkData.length > 0) res.json(checkData[0].maximum);
    else {
        res.send("0");
    }
})
export default router;
