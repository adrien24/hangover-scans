const url = import.meta.env.VITE_BACKEND_URL;

export const getAllScans = async (id: string, title: string) => {
  const response = await fetch(`${url}/api/mangas/${title}/scans/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + import.meta.env.VITE_SUPABASE_KEY,
      "X-Page-Id": id,
      "X-Scan-Title": title,
    },
  });

  const result = await response.json();
  console.log("getAllScans result:", id, title);

  return result.scans[0];
};
