
import { createClient } from '@supabase/supabase-js'
export const getSupabase = () => {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' ? localStorage.getItem('sb_url') : null)
 const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? localStorage.getItem('sb_anon') : null)
 if(!url || !key || url.includes('xxxx')) return null
 return createClient(url, key)
}
