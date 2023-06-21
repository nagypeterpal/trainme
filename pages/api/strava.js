import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    externalResolver: true,
  },
};

const updateUserData = async (
  refresh_token,
  access_token,
  expires_at,
  strava_id
) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  try {
    console.log("updateUserData");
    const { data, error } = await supabase
      .from("profiles")
      .update([
        {
          refresh_token: refresh_token,
          access_token: access_token,
          expires_at: expires_at,
        },
      ])
      .eq("strava_id", strava_id);
  } catch (err) {
    console.log(err);
  }
};

const handleTraining = async (access_token, owner_id, object_id) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const url =
    "https://www.strava.com/api/v3/activities/" +
    object_id +
    "?access_token=" +
    access_token;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //if we have the new tokens the n update user data and query the training
      console.log("handleTraining");
      console.log(url);
      console.log(data);
      supabase.from("athlete_activities").insert([
        {
          title: data.name,
          type: data.type,
          start_date: data.start_date_local.substring(1, 10),
          moving_time: data.moving_time,
          elapsed_time: data.elapsed_time,
          distance: data.distance,
          elavation: data.elev_high - data.elev_low,
          max_speed: data.max_speed,
          athlete_id: owner_id,
        },
      ]);
    })
    .catch((err) => console.log(err));
};

const saveData = async (txt, object_id, owner_id, action_type, object_type) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  console.log("save data");
  try {
    //save the received training id
    await supabase.from("strava_webhook_items").insert([
      {
        txt: txt,
        object_id: object_id,
        owner_id: owner_id,
        action_type: action_type,
        object_type: object_type,
      },
    ]);

    if (action_type == "create") {
      //then we load the saved refresh token
      const { data: userdata, error } = await supabase
        .from("profiles")
        .select(`refresh_token`)
        .eq("strava_id", owner_id)
        .single();

      //then refresh the tokens and query training data
      let _data = {
        client_id: 96151,
        client_secret: "f7f9eda36da17cd5188fc7c089e040768df7dfb9",
        grant_type: "refresh_token",
        refresh_token: userdata.refresh_token,
      };

      fetch(`https://www.strava.com/api/v3/oauth/token`, {
        method: "POST",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("refresh token");
          console.log(data);
          //if we have the new tokens the n update user data and query the training
          updateUserData(
            data.refresh_token,
            data.access_token,
            data.expires_at,
            owner_id
          );
          handleTraining(data.access_token, owner_id, object_id);
        })
        .catch((err) => console.log(err));
    }
  } catch (err) {
    console.log(err);
  }
};

export default function handler(req, res) {
  //this is for the webhook response to complete registration
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

  //saving the data
  if (req.method == "POST") {
    console.log("save webhook");
    console.log(req.body);

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
