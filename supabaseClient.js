import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.supabaseURL;
const supabaseKey = process.env.supabasekey;


export const supabase = createClient(supabaseUrl, supabaseKey);
