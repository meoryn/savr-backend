import express from 'express';
import { supabase } from './supabaseClient.js';
import { userMap, userIDtoAccountID } from './AccountIDHandler.js';
const router = express.Router();



router.post('/usedCategories', async (req, res) => {
    const {user_id, type} = req.body;
    const refreshToken = req.headers["x-refresh-token"];
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
    if (sessErr) return res.status(401).json({ error: "Invalid token", detailed: sessErr })

    let account_id = userIDtoAccountID(user_id);

    if (!account_id) {
        const { data: accountData, error: accountError } = await supabase
            .from("account")
            .select("account_id")

        if (accountError) console.log(accountError);
        userMap.set(user_id, accountData[0].account_id);
        account_id = accountData[0].account_id;
    }
    // Token auslesen


    const { data, error } = await supabase
        .from("monthly_report")
        .select("category_name")
        .eq("account_id", account_id)
        .eq("type", type)


    const categoryNames = data.map(item => item.category_name);

    const uniqueCategoryNamesSet = new Set(categoryNames);

    const uniqueData = Array.from(uniqueCategoryNamesSet).map(category_name => ({ category_name: category_name }));
    


    if (error) {
        res.json(error);
    }
    res.json(uniqueData);

})


export default router;