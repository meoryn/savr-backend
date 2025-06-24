import express from 'express';
import { supabase } from './supabaseClient.js';
import { userMap } from './AccountIDHandler.js';
import { userIDtoAccountID } from './AccountIDHandler.js';
const router = express.Router();


router.get("/table", async (req, res) => {
    const { selectedColumns, userId, tableName } = req.body;

    const refreshToken = req.headers["x-refresh-token"];

    console.log(selectedColumns);
    console.log(tableName);

    let selectString;
    if (selectedColumns) {
        selectString = selectedColumns.reduce(function (pre, next) {
            return pre + ", " + next;
        });
        console.log(selectString);
    }


    // Token auslesen
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

    const { data, error } = await supabase.
        from(tableName)
        .select(selectedColumns ? selectString : "*")


    res.status(201);
    if(error) {
        res.json(error);
    }
    res.json(data);
});

export default router;