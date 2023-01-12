import Head from 'next/head'
import Image from 'next/image'
import { createServerSupabaseClient} from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Avatar from '../../components/Avatar'

export default function Home({user}) {

  const supabaseClient = useSupabaseClient()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(true)
  const [website, setWebsite] = useState(true)
  const [avatarurl, setAvatarurl] = useState(true)
  
  const [plancount, setPlanCount] = useState(true)

  useEffect(() => {
    getUserData()
    getPlanData()
  }, [user])

  async function getUserData() {
    try {
    
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarurl(data.avatar_url)
      }

    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
     
    }
  }

  //getting plan data
  async function getPlanData() {
      let { count,error } = await supabase.from('training_plans').select('*', { count: 'exact', head: true })
      if (error) { console.log(error)}
      if (count) { setPlanCount(count)}
  }




  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-blue-500 hover:bg-blue-600 p-8">
        <div className="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white mb-8 p-4 text-6xl w-96">TrainMe</div>
        <div><Avatar uid={user.id} url={avatarurl}  size={150}/></div>  
        <div className="text-white my-4 text-2xl">{username}</div>  
        <div>{website}</div>  

      </div>

      <main className="text-3xl font-bold underline">
        {user.email}        {username}        {website}          {avatarurl} ------  {plancount}
        <button className="button block" onClick={async () => { await supabaseClient.auth.signOut(); router.push('/');  }}> Sign Out</button>
      </main>

      <footer></footer>
    </div>
  )
}


export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabaseServer = createServerSupabaseClient(ctx)
  // Check if we have a session
  const { data: { session }, } = await supabaseServer.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}