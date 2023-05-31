import Head from "next/head";
import dynamic from "next/dynamic";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Avatar from "../../components/Avatar";
import Image from "next/image";
import {
  UserCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
const TM_PieChart = dynamic(import("../../components/TM_PieChart"), {
  ssr: false,
});

export default function Home({ user, training }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>TrainMe</title>
        <meta name="description" content="trainme app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-sky-500 hover:bg-sky-400 p-8">
        <div className="rounded-2xl border-white border-4 text-white mb-16 p-4 text-6xl w-80 block">
          TrainMe{" "}
          <Image
            src="/running.png"
            alt="running.png"
            width={50}
            height={50}
            className="inline"
          />
        </div>
        <div className="mb-2 rounded-2xl bg-white overflow-hidden w-36">
          <Avatar
            uid={user.id}
            url={user.avatarurl}
            size={150}
            readOnly={true}
          />
        </div>
        <div className="text-white mb-8 text-2xl">
          {user.name}
          <div className="text-white  text-sm inline p-1 m-2">
            <GlobeAltIcon className="h-6 w-6 text-white inline" />
            <a href="{user.website}">{user.website}</a>
          </div>
        </div>

        <button
          className="button  text-white rounded-xl border-white  border-2 p-2 m-2 text-center inline text-sm"
          onClick={async () => {
            await router.push("/protected/profile");
          }}
        >
          <UserCircleIcon className="h-6 w-6 text-white" />
          Profile
        </button>
        <button
          className="button  text-white rounded-xl border-white bg-red-500 border-2 p-2 m-2 inline text-sm"
          onClick={async () => {
            await supabaseClient.auth.signOut();
            router.push("/");
          }}
        >
          <XCircleIcon className="h-6 w-6 text-white" />
          Sign Out
        </button>
      </div>

      <main>
        <div className="bg-gray-300 hover:bg-gray-500 px-8 text-gray-600 text-4xl p-2">
          Aggregated training data
        </div>

        <div className="flex flex-col bg-gradient-to-b from-sky-50 to-sky-100 p-2">
          <div className="mx-auto grid grid-cols-2 gap-10 max-w-4xl">
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
              <br />
              <span className="text-sky-500 text-sm">
                You have already done this many trainings from the total.
              </span>
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
              <br />
              <span className="text-sky-500 text-sm">
                You have already done this many kilometers from the total.
              </span>
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
              <br />
              <span className="text-sky-500 text-sm whitespace-normal">
                You have already done this many minuts from the total planned
                trainings, the number in the middle shows the mnutes you were
                idle while the tracker was running.
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
          </div>
        </div>
        <div className="bg-gray-300 hover:bg-gray-500 px-8 text-gray-600 text-4xl p-2">
          Detailed training data
        </div>
        <div className="flex flex-col bg-gradient-to-b from-sky-50 to-sky-100 p-2">
          <div className="mx-auto grid grid-cols-2 gap-10 max-w-4xl">
            {training.lines.map((line) => (
              <div className="p-2 col-span-2" key={line.p_plan_line_id}>
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
