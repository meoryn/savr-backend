import express from 'express';
import { supabase } from './supabaseClient.js';
import { userMap } from './AccountIDHandler.js';
import { userIDtoAccountID } from './AccountIDHandler.js';
const router = express.Router();


router.post("/transactions", async (req, res) => {
    const { user_id, category_id, amount, type, date} = req.body;

    const refreshToken = req.headers["x-refresh-token"];


    // Token auslesen
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Missing token" })

    // Session setzen
    const { data: userData, error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
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


    const { data: insertionData, error: insertionError } = await supabase //Neuer Eintrag in Transactions table
        .from('transaction')
        .insert([
            {
                user_id: user_id,
                account_id: account_id,
                category_id: category_id,
                amount: amount,
                type: type,
                date: date
            },
        ])

    if (insertionError) {
        console.log(insertionError);
    }


    //Aktuelle Balance holen
    let oldbalance;
    const { data: balanceData, error: balanceError } = await supabase
        .from('account')
        .select('balance')

    oldbalance = balanceData[0].balance;

    if (balanceError) {
        console.log("Fehler beim Abrufen der Balance : " + balanceError);
    }


    //Balance updaten
    let newBalance = oldbalance;
    if (type == "expense") {
        newBalance -= amount;
    } else {
        newBalance += amount;
    }

    let { data: updateData, updateError } = await supabase
        .from('account')
        .update({ balance: newBalance })
        .eq('account_id', account_id);


    if (updateError) {
        console.log('Fehler beim Updaten der Balance:', error.message);
    }




    res.status(201);
    res.send("Success");
});

export default router;