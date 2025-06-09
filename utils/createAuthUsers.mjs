// utils/createAuthUsers.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://mufqimmxygsryxrigkec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZnFpbW14eWdzcnl4cmlna2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI1ODkyNiwiZXhwIjoyMDY0ODM0OTI2fQ.fY2YaBV-TpA9ccPKRvHpBzCUizPleIQ_3WUpm6Wr6pM'; // NOT anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const members = await supabase.from('members').select('id, full_name');

for (const member of members.data) {
  const email = `user${member.id}@example.com`;
  const password = '123456'; // Same for all test users

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // immediate activation
  });

  if (error) {
    console.error(`❌ Failed to create auth user for member ${member.id}`, error.message);
  } else {
        // Update users table to link this new auth id
    await supabase.from('users').update({ id: data.user.id }).eq('member_id', member.id);
  }
}