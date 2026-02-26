const url = import.meta.env.VITE_BACKEND_URL;

export const getManga = async () => {
  console.log("start");

  const response = await fetch(url + "/api/mangas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log(result);

  return result.data;
};
