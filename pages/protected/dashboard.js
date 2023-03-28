import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Avatar from "../../components/Avatar";
const TM_PieChart = dynamic(import("../../components/TM_PieChart"), {
  ssr: false,
});

export default function Home({ user, training }) {
  console.log(training);

  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [plancount, setPlanCount] = useState(true);

    //getting plan data
  async function getPlanData() {
    let { count, error } = await supabaseClient
      .from("training_plans")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.log(error);
    }
    if (count) {
      setPlanCount(count);
    }
  }
  
  useEffect(() => {
    getPlanData();
  }, [user]);

  return (
    <div>
      <Head>
        <title>TrainMe</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-sky-500 hover:bg-sky-400 p-8">
        <div className="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white mb-8 p-4 text-6xl w-96">
          TrainMe
        </div>
        <div className="mb-8 p-4 text-6xl w-48">
          <Avatar
            uid={user.id}
            url={user.avatarurl}
            size={150}
            readOnly={true}
          />
        </div>
        <div className="text-white my-4 text-2xl">{user.name}</div>
        <div>{user.website}</div>
        <button
          className="button block"
          onClick={async () => {
            await router.push("/protected/profile");
          }}
        >
          {" "}
          Profile
        </button>
        <button
          className="button block"
          onClick={async () => {
            await supabaseClient.auth.signOut();
            router.push("/");
          }}
        >
          {" "}
          Sign Out
        </button>
      </div>

      <main>
        <div className="flex flex-col bg-gradient-to-b from-sky-50 to-sky-100">
          <div className="mx-auto grid grid-cols-2 gap-10">
            <span className="col-span-2 text-sky-500 text-4xl p-2">
              Aggragated data
            </span>
            <div className="p-2">
              <TM_PieChart
                data={[
                  {
                    name: "Trainings done",
                    value: training.agg.act_pcs_tot,
                    color: "#0ea5e9",
                  },
                  {
                    name: "Trainings left",
                    value: training.agg.pla_pcs_tot - training.agg.act_pcs_tot,
                    color: "#ffffff",
                  },
                ]}
              />
              Number of trainings:
              <span className="text-sky-500 text-4xl p-2">
                {training.agg.act_pcs_tot}
              </span>
              /<span>{training.agg.pla_pcs_tot}</span>
            </div>

            <div className="p-2">
              <TM_PieChart
                data={[
                  {
                    name: "Distance done",
                    value: training.agg.act_dis_tot,
                    color: "#0ea5e9",
                  },
                  {
                    name: "Distance left",
                    value: training.agg.pla_dis_tot - training.agg.act_dis_tot,
                    color: "#ffffff",
                  },
                ]}
              />
              Distance (km):
              <span className="text-sky-500 text-4xl p-2">
                {training.agg.act_dis_tot}
              </span>
              /<span>{training.agg.pla_dis_tot}</span>
            </div>

            <div className="p-2">
              <TM_PieChart
                data={[
                  {
                    name: "Time moved",
                    value: training.agg.act_mot_tot,
                    color: "#0ea5e9",
                  },
                  {
                    name: "Time elapsed",
                    value: training.agg.act_elt_tot - training.agg.act_mot_tot,
                    color: "#7dd3fc",
                  },
                  {
                    name: "Time left",
                    value: training.agg.pla_tim_tot - training.agg.act_elt_tot,
                    color: "#ffffff",
                  },
                ]}
              />
              Time (min):
              <span className="text-sky-500 text-4xl p-2">
                {training.agg.act_mot_tot}
              </span>
              /
              <span>
                {training.agg.act_elt_tot - training.agg.act_mot_tot}/
                {training.agg.pla_tim_tot}
              </span>
            </div>

            <div className="p-2">
              Elevation total (m):
              <span className="text-sky-500 text-4xl p-2">
                {training.agg.act_ele_tot}
              </span>
              <br />
              Max speed (km/h):
              <span className="text-sky-500 text-4xl p-2">
                {training.agg.act_spe_max}
              </span>
            </div>
            <span className="text-sky-500 text-4xl p-2 col-span-2">
              Detailed training data
            </span>
            {training.lines.map((line) => (
              <div className="p-2 col-span-2">
                <hr />
                <span className="text-sky-500 text-2xl">
                  {line.p_plan_line_id}. training
                </span>
                <span className="text-sky-500 text-xl">
                  - {line.p_plan_date}/{line.a_type} - {line.a_title} -
                  {line.a_type}
                </span>
                <br />
                Distance: {line.a_distance}/{line.p_distance} km
                <br />
                Time: {line.a_moving_time}/{line.p_time} minute
                <br />
                Elevation:{line.a_elevation} - Max speed:{line.a_max_speed}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer></footer>
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

  //query training data
  const trainingdata = {};

  // getting aggregated data
  let {
    data: sb_tr_agg_data,
    error: sb_tr_agg_error,
    status: sb_tr_agg_status,
  } = await supabaseServer.rpc("get_training_data_agg", {
    userid: session.user.id,
  });
  if (sb_tr_agg_data) {
    let parsed = JSON.parse(sb_tr_agg_data);
    trainingdata.agg = parsed;
  }

  // getting detailed data
  let {
    data: sb_tr_det_data,
    error: sb_tr_det_error,
    status: sb_tr_det_status,
  } = await supabaseServer.rpc("get_training_data_detail", {
    userid: session.user.id,
  });
  if (sb_tr_det_data) {
    let parsed = JSON.parse(sb_tr_det_data);
    trainingdata.lines = parsed;
  }

  return {
    props: {
      initialSession: session,
      user: userdata,
      training: trainingdata,
    },
  };
};
