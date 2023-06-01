import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default function handler(req, res) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const { error } = await supabase
  .from('debug')
  .insert({ txt: req.body });
}