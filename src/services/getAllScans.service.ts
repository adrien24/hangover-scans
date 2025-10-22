export const getAllScans = async (id: string, title: string) => {
  console.log('getAllScans called with:', id, title)

  const response = await fetch('https://ajtyenefvkagyajggfrv.functions.supabase.co/get-scans', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + import.meta.env.VITE_SUPABASE_KEY,
      'X-Page-Id': id,
      'X-Scan-Title': title,
    },
  })

  const result = await response.json()
  console.log('getAllScans result:', id, title)

  return result.data
}
