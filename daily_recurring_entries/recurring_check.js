import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { userIDtoAccountID, userMap } from '../AccountIDHandler.js';
const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabasekey;


export const supabase = createClient(supabaseUrl, supabaseKey);
const today = new Date().getDate();
const fullDate = new Date().toISOString().slice(0, 10);

async function fetchRecurringEntries() {
  const { data, error } = await supabase
    .from('recurring_entry')
    .select("*")
    .eq("day", today);

  if (error) {
    console.log("Fehler beim Abfragen von recurring_entries : " + error);
  } else {
    return data
  }
}

const entries = await fetchRecurringEntries();

for (const entry of entries) {
  console.log(entry);

  const { user_id, category_id, amount} = entry;

  let account_id = userIDtoAccountID(user_id);
  if (!account_id) {
    const { data: accountData, error: accountError } = await supabase
      .from("account")
      .select("account_id")
      .eq("user_id", user_id);

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
        type: "expense",
        date: fullDate
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
    .eq("user_id", user_id);

  oldbalance = balanceData[0].balance;

  if (balanceError) {
    console.log("Fehler beim Abrufen der Balance : " + balanceError);
  }


  //Balance updaten
  let newBalance = oldbalance - amount

  let { data: updateData, updateError } = await supabase
    .from('account')
    .update({ balance: newBalance })
    .eq('account_id', account_id);


  if (updateError) {
    console.log('Fehler beim Updaten der Balance:', error.message);
  }
}

