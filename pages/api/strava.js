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
  if (req.method == "GET") {
    const VERIFY_TOKEN = "STRAVA";
    // Parses the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Verifies that the mode and token sent are valid
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.json({ "hub.challenge": challenge });
        res.status(200).send("ok");
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.status(403);
      }
    }

    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  if (req.method == "POST") {
    //const body = JSON.parse(req.body);
    console.log(req.query);
    console.log(req.body);
    saveData(req.query + " - " + req.body);

    res.status(200).send("ok");
  }
}
