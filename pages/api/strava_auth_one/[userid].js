import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const config = {
  api: {
    externalResolver: true,
  },
};

const updateData = async (
  refresh_token,
  access_token,
  expires_at,
  strava_id,
  scopes,
  id
) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update([
        {
          refresh_token: refresh_token,
          access_token: access_token,
          expires_at: expires_at,
          strava_id: strava_id,
          scopes: scopes,
        },
      ])
      .eq("id", id);
  } catch (err) {
    console.log(err);
  }
};

export default async function handler(req, res) {
  let _data = {
    client_id: 96151,
    client_secret: "f7f9eda36da17cd5188fc7c089e040768df7dfb9",
    code: req.query.code,
    grant_type: "authorization_code",
  };

  if (req.query.scope.includes("activity:read")) {
    fetch(`https://www.strava.com/api/v3/oauth/token`, {
      method: "POST",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        updateData(
          data.refresh_token,
          data.access_token,
          data.expires_at,
          data.athlete.id,
          req.query.scope,
          req.query.userid
        );
      })
      .catch((err) => console.log(err));
  }

  return res.redirect(307, "/protected/dashboard");
}
