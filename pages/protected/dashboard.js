import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { createServerSupabaseClient} from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Home({user}) {

  const supabaseClient = useSupabaseClient()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(true)
  const [website, setWebsite] = useState(true)
  const [avatarurl, setAvatarurl] = useState(true)

  useEffect(() => {
    getData()
  }, [user])

  async function getData() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarurl(data.avatar_url)
      }
    
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {user.email}        {username}        {website}          {avatarurl}
        <button className="button block" onClick={async () => { await supabaseClient.auth.signOut(); router.push('/');  }}> Sign Out</button>
      </main>

      <footer className={styles.footer}></footer>
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