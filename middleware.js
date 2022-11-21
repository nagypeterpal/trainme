import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {data: { session },} = await supabase.auth.getSession()

  if (!session) { 
    if(req.nextUrl.pathname.match('/protected/')){
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res;

}
