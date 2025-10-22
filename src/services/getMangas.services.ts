export const getMangaSupabase = async (id?: string) => {
  const response = await fetch('https://ajtyenefvkagyajggfrv.supabase.co/functions/v1/get-mangas', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + import.meta.env.VITE_SUPABASE_KEY,
    },
  })

  const result = await response.json()
  return result.data
}
