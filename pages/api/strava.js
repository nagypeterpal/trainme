//import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    externalResolver: true,
  },
};

const saveData = async (whatToSave) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  try {
    const { data, error } = await supabase
      .from("debug")
      .insert([{ txt: whatToSave }]);
  } catch (err) {
    console.log(err);
  }
};

export default function handler(req, res) {
  saveData(JSON.stringify(JSON.stringify(req.query)));
  //console.log(req);
  //res.status(200).json(JSON.stringify(req.query));
}
