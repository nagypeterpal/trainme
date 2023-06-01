//import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createClient } from "@supabase/supabase-js";

const saveData = async (whatToSave) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  try {
    const { error } = await supabase.from("debug").insert({ txt: whatToSave });
  } catch (err) {}
};

export default function handler(req, res) {
  saveData(req);
}
