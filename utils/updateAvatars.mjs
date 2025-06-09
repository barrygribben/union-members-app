import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://mufqimmxygsryxrigkec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZnFpbW14eWdzcnl4cmlna2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI1ODkyNiwiZXhwIjoyMDY0ODM0OTI2fQ.fY2YaBV-TpA9ccPKRvHpBzCUizPleIQ_3WUpm6Wr6pM'; // NOT anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bucketName = 'avatars';

async function uploadAvatar(user) {
  const hash = [...user.id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = `https://randomuser.me/api/portraits/men/${hash % 100}.jpg`;

  try {
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!res.ok) throw new Error(`Image fetch failed for ID ${user.id}`);
    
    const filePath = `avatars/user-${user.id}.jpg`;

    // Upload image
    const { error: uploadError } = await supabase.storage
    const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, buffer, {
      contentType: 'image/jpeg',
    });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    console.log(`Uploaded image for ${user.full_name}`);

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${filePath}`;

    // Update user row
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) throw new Error(`Update failed: ${updateError.message}`);
    console.log(`Updated avatar URL for ${user.full_name}`);

  } catch (err) {
    console.error(`❌ Failed for ${user.full_name}:`, err.message);
  }
}

async function run() {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, full_name')
    .like('full_name', 'David%');

  if (error) {
    console.error('Error fetching users:', error.message);
    return;
  }

  console.log(`Found ${users.length} David(s)`);
  for (const user of users) {
    await uploadAvatar(user);
  }

  console.log('✅ Finished uploading avatars.');
}

run();
