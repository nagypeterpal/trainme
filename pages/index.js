import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  const session   = useSession()
  const supabase  = useSupabaseClient()
  const router    = useRouter()
  if(session){router.push('/protected/dashboard')}

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div class="flex h-screen">
        <div class="m-auto">
          <div className="flex-initial m-1.5">
            <h1 className="text-3xl mt-6 text-regalblue">Please login</h1>
          </div>
          <div>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
          </div>
        </div>
      </div>
   
      <footer className={styles.footer}>
       
      </footer>
    </div>
  )
}
