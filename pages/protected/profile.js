import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Avatar from "../../components/Avatar";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Account({ user, plans, activeplan }) {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [strava_id, setStravaId] = useState(null);
  const [active_plan, setActivePlan] = useState(null);

  useEffect(() => {
    setUsername(user.name);
    setWebsite(user.website);
    setAvatarUrl(user.avatarurl);
    setStravaId(user.stravaid);
    setActivePlan(activeplan);
  }, [activeplan, user]);

  const planItems = plans.map((plan) => (
    <div
      onClick={() => choosePlan(plan.id)}
      key={plan.id}
      className={
        active_plan == plan.id
          ? "text-white bg-gradient-to-r from-sky-600 to-sky-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          : "text-white bg-gradient-to-r from-sky-200 to-sky-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      }
    >
      {plan.name}
    </div>
  ));

  async function updateProfile({ username, website, avatar_url, strava_id }) {
    try {
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        strava_id,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
    }
  }

  async function choosePlan(planId) {
    if (window.confirm("Do you really want to change?")) {
      try {
        const updates = {
          userid: user.id,
          planid: planId,
          updated_at: new Date().toISOString(),
        };
        console.log(updates);

        let { data, error } = await supabase.rpc("update_plan", updates);
        if (error) throw error;
        setActivePlan(planId);
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-100 to-blue-300">
      <div className="max-w-md m-auto bg-white rounded-xl shadow-md p-8">
        <div className="m-10">
          <Avatar
            uid={user.id}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <label
            for="email"
            className="block mb-2 p-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={user.email}
            disabled
            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="website"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <label htmlFor="stravaid">Strava id</label>
          <input
            id="strava_id"
            type="strava_id"
            value={strava_id || ""}
            onChange={(e) => setStravaId(e.target.value)}
            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <button
            type="button"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() =>
              updateProfile({ username, website, avatar_url, strava_id })
            }
          >
            Update profile
          </button>
          <div></div>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => {
              router.push("/protected/dashboard");
            }}
          >
            Back to Dashboard
          </button>
        </div>

        <div>
          <div className="text-lg">Current plan:</div>
          <div className="text-xs">
            Choose carefully, previouse data will be archived
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">{planItems}</div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabaseServer = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (!session) return { redirect: { destination: "/", permanent: false } };

  //query user data
  const userdata = {};
  let {
    data: sb_userdata,
    error: sb_usererror,
    status: sb_userstatus,
  } = await supabaseServer
    .from("profiles")
    .select(`username, website, avatar_url,strava_id`)
    .eq("id", session.user.id)
    .single();
  if (sb_userdata) {
    userdata.email = session.user.email;
    userdata.id = session.user.id;
    userdata.name = sb_userdata.username;
    userdata.website = sb_userdata.website;
    userdata.avatarurl = sb_userdata.avatar_url;
    userdata.stravaid = sb_userdata.strava_id;
  }

  //query plans
  let plandata = {};
  let {
    data: sb_plandata,
    error: sb_planerror,
    status: sb_planstatus,
  } = await supabaseServer.from("training_plans").select(`id,name`);
  if (sb_plandata) {
    plandata = sb_plandata;
  }

  //query active plan
  let planactive = {};
  const {
    data: sb_curplan,
    error: sb_curplanerror,
    status: sb_curplanstatus,
  } = await supabaseServer
    .from("athlete_plans")
    .select("plan_id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  planactive = sb_curplan?.plan_id ? sb_curplan?.plan_id : 0;

  return {
    props: {
      initialSession: session,
      user: userdata,
      plans: plandata,
      activeplan: planactive,
    },
  };
};
