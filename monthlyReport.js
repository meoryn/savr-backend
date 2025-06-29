import express from 'express';
import { supabase } from './supabaseClient.js';
import { userMap, userIDtoAccountID } from './AccountIDHandler.js';
const router = express.Router();



router.post('/monthlyReport', async (req, res) => {
    const user_id = req.body.user_id;
    const refreshToken = req.headers["x-refresh-token"];
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" });
    if (!user_id) return res.status(401).json({ error: "Missing user_id" });
    if (!refreshToken) return res.status(401).json({ error: "Missing refresh_token" });



    // Session setzen
    const { data: userData, error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

    let account_id = userIDtoAccountID(user_id);

    console.log('fetched accountID for ', user_id, ': ', account_id);

    if (!account_id) {
        const { data: accountData, error: accountError } = await supabase
            .from("account")
            .select("account_id")


        console.log(accountData);

        if (accountError) console.log(accountError);
        userMap.set(user_id, accountData[0].account_id);
        account_id = accountData[0].account_id;
    }
    // Token auslesen


    const { data, error } = await supabase
        .from("monthly_report")
        .select("sum, type, transaction_date, category_name")
        .eq("account_id", account_id)
        .order("transaction_date");


    console.log('Fetched Data', data);


    res.set("new-x-refresh-token", userData.session.refresh_token);
    res.set("jwt", userData.session.access_token);
    if (error) {
        res.json(error);
    }
    return res.json(data);

})


export default router;
