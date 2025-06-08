import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mufqimmxygsryxrigkec.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZnFpbW14eWdzcnl4cmlna2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTg5MjYsImV4cCI6MjA2NDgzNDkyNn0.wSKVcocMI1oahb68MhDCyQcqem8NimF18rtm-HpNUOs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);