import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    externalResolver: true,
  },
};

const saveData = async (txt, object_id, owner_id, action_type, object_type) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  try {
    const { data, error } = await supabase.from("strava_webhook_items").insert([
      {
        txt: txt,
        object_id: object_id,
        owner_id: owner_id,
        action_type: action_type,
        object_type: object_type,
      },
    ]);
  } catch (err) {
    console.log(err);
  }
};

export default function handler(req, res) {
  if (req.method == "GET") {
    const VERIFY_TOKEN = "STRAVA";
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    console.log(mode + " - " + token);
    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        res.status(200).json({ "hub.challenge": challenge });
      }
    }
    res.status(200);
  }

  if (req.method == "POST") {
    saveData(
      req.body,
      req.body.object_id,
      req.body.owner_id,
      req.body.aspect_type,
      req.body.object_type
    );
    res.status(200).send("ok");
  }
  return;
}
