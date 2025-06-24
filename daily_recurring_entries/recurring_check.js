import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabasekey;


export const supabase = createClient(supabaseUrl, supabaseKey);
const today = new Date().getDate();

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

for(const entry of entries) {
  console.log(entry);
}