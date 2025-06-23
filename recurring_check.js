import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabasekey;


const supabase = createClient(supabaseUrl, supabaseKey);



const today = new Date().getDate();


const refreshToken = "ls5dawufcgit";
const token = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkhVcDNwK2h3RVduK005b3IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2R0eHp4Z2Nta2Z3YnJhc255d2l5LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5NTYwOTAzMi1iM2M3LTRiYTUtYTQ1Yy02NzYzZWFlMjA3ZjEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUwNjMzMDg5LCJpYXQiOjE3NTA2Mjk0ODksImVtYWlsIjoiamFuZGwubWF4aW1pbGlhbjExQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJqYW5kbC5tYXhpbWlsaWFuMTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiOTU2MDkwMzItYjNjNy00YmE1LWE0NWMtNjc2M2VhZTIwN2YxIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTA2Mjk0ODl9XSwic2Vzc2lvbl9pZCI6IjMxZDhjMDEyLWY5YTEtNGM1YS1iZGY3LTY0N2Q3OTUxOTIyYSIsImlzX2Fub255bW91cyI6ZmFsc2V9.Qm8mh26qk-MBlh8SkppgDtn4hICSgd52_1dPFIqgIBk"

const { error: sessErr } = await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken });
if(sessErr) console.log(sessErr);

let { entries, error } = await supabase
  .from('recurring_entry')
  .select("*")
  .eq("day", today);

console.log(entries);


const { user_id, account_id, category_id, amount, type } = req.body;


try {
const { data, error } = await supabase //Neuer Eintrag in Transactions table
  .from('transaction')
  .insert([
    {
      user_id: user_id,
      account_id: account_id,
      category_id: category_id,
      amount: amount,
      type: type
    },
  ])

} catch (error) {
  console.error('Fehler beim Eintragen der Transaktion:', error.message);
}

let oldbalance;
try {     //Aktuelle Balance holen
  let { data: balance, error } = await supabase
    .from('account')
    .select('balance')
    .eq('account_id', account_id);

  oldbalance = balance[0].balance;

} catch (error) {
  console.error('Fehler beim Abrufen der Balance:', error.message);
  return null;
}

try {     //Balance updaten
  let newBalance = oldbalance;
  if (type == "expense") {
    newBalance -= amount;
  } else {
    newBalance += amount;
  }

  let { data: balance, error } = await supabase
    .from('account')
    .update({ balance: newBalance })
    .eq('account_id', account_id);


} catch (error) {
  console.error('Fehler beim Updaten der Balance:', error.message);
  return null;

