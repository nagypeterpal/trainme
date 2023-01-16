import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Avatar from '../../components/Avatar'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Account({ user }) {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [strava_id, setStravaId] = useState(null)

  useEffect(() => {
    setUsername(user.name)
    setWebsite(user.website)
    setAvatarUrl(user.avatarurl)
    setStravaId(user.stravaid)
  },[])

   async function updateProfile({ username, website, avatar_url,strava_id }) {
    try {
     
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        strava_id,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
       }
  }

  return (
    <div className="form-widget">
      <Avatar
      uid={user.id}
      url={avatar_url}
      size={150}
      onUpload={(url) => {
        setAvatarUrl(url)
        updateProfile({ username, website, avatar_url: url })
      }}
    />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input id="website" type="website" value={website || ''} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div>
        <label htmlFor="stravaid">Strava id</label>
        <input id="strava_id" type="strava_id" value={strava_id || ''} onChange={(e) => setStravaId(e.target.value)} />
      </div>

      <div>
        <button className="button primary block" onClick={() => updateProfile({ username, website, avatar_url, strava_id })}>Update</button>
      </div>

      <div>
       <button className="button block" onClick={() => { router.push('/protected/dashboard'); }}> Dashboard</button>
       </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabaseServer = createServerSupabaseClient(ctx)
  // Check if we have a session
  const { data: { session }, } = await supabaseServer.auth.getSession()
  //userdata
  let userdata = {}

  if (!session) return { redirect: {  destination: '/',  permanent: false,  }, }

  //query user data
  let { data, error, status } = await supabaseServer
  .from('profiles')
  .select(`username, website, avatar_url,strava_id`)
  .eq('id', session.user.id)
  .single()

  if (data) {
    userdata.email=session.user.email;
    userdata.id=session.user.id;
    userdata.name=data.username;
    userdata.website=data.website;
    userdata.avatarurl=data.avatar_url;
    userdata.stravaid=data.strava_id;
  }



  return {
    props: {
      initialSession: session,
      user: userdata,
    },
  }
}
