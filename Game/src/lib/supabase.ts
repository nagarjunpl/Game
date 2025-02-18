import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcxmjsxtweinxgsibffm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjeG1qc3h0d2Vpbnhnc2liZmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NDYzNzksImV4cCI6MjA1NDUyMjM3OX0.DTXdsRzjzzzfvl1ATMtAkRUBLlba_XGxJnf7Otg7H60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);