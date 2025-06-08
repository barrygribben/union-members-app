import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://mufqimmxygsryxrigkec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZnFpbW14eWdzcnl4cmlna2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI1ODkyNiwiZXhwIjoyMDY0ODM0OTI2fQ.fY2YaBV-TpA9ccPKRvHpBzCUizPleIQ_3WUpm6Wr6pM'; // NOT anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bucketName = 'avatars';

async function uploadAvatar(member) {
  const imageUrl = `https://randomuser.me/api/portraits/men/${member.id % 100}.jpg`;

  try {
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!res.ok) throw new Error(`Image fetch failed for ID ${member.id}`);
    
    const filePath = `avatars/member-${member.id}.jpg`;

    // Upload image
    const { error: uploadError } = await supabase.storage
    const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, buffer, {
      contentType: 'image/jpeg',
    });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
    console.log(`Uploaded image for ${member.full_name}`);

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${filePath}`;

    // Update member row
    const { error: updateError } = await supabase
      .from('members')
      .update({ avatar_url: publicUrl })
      .eq('id', member.id);

    if (updateError) throw new Error(`Update failed: ${updateError.message}`);
    console.log(`Updated avatar URL for ${member.full_name}`);

  } catch (err) {
    console.error(`❌ Failed for ${member.full_name}:`, err.message);
  }
}

async function run() {
  const { data: members, error } = await supabase
    .from('members')
    .select('id, full_name')
    .like('full_name', 'Darren%');

  if (error) {
    console.error('Error fetching members:', error.message);
    return;
  }

  console.log(`Found ${members.length} Darren(s)`);
  for (const member of members) {
    await uploadAvatar(member);
  }

  console.log('✅ Finished uploading avatars.');
}

run();
