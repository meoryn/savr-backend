import express from 'express';
import { supabase } from './supabaseClient.js';
const router = express.Router();



router.post('/monthly_limit', async (req, res) => {

    const { user_id, category_name, maximum } = req.body;

    const refreshToken = req.headers["x-refresh-token"];
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

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

    //Checken ob Limit bereits vorhanden
    const { data: checkData, error: errorData } = await supabase
        .from("monthly_limit")
        .select("*")
        .eq("user_id", user_id)
        .eq("category_id", category_id);

    if (errorData) console.log("Fehler bei der Anfrage an monthly_limit, ob ein Limit bereits vorhanden ist : " + errorData);

    if (checkData.length == 0) { //Wenn es noch nicht vorhanden ist

        //Monatliches Maximum in monthly_limit eintragen
        const { data, error } = await supabase
            .from('monthly_limit')
            .insert([
                {
                    user_id: user_id,
                    category_id: category_id,
                    maximum: maximum
                },
            ])
    } else { //vorhandenes Maximum updaten

        const { data: updateData, error: errorData } = await supabase
            .from("monthly_limit")
            .update({ maximum: maximum })
            .eq("user_id", user_id)
            .eq("category_id", category_id)

        if (errorData) console.log("Fehler beim updaten des Limits : " + errorData);
    }



    res.set("new-x-refresh-token", userData.session.refresh_token);
    res.set("jwt", userData.session.access_token);

    res.status(201);
    res.send("Success");




})
export default router;