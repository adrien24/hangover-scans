import type { UserContext } from "@/types/userdata.types";

const url = import.meta.env.VITE_BACKEND_URL;

type Scan = {
  id: number;
  title: string;
  description: string;
  images: string[];
};

export interface GetAllScansResult {
  scan: Scan;
  totalChapters: number;
  userContext: UserContext | null;
}

function authOrPublicHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("auth_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const getAllScans = async (
  id: string,
  title: string
): Promise<GetAllScansResult> => {
  const response = await fetch(
    `${url}/api/mangas/${title}/scans/${id}`,
    {
      method: "GET",
      headers: authOrPublicHeaders(),
    }
  );

  const result = await response.json();

  return {
    scan: result.scans[0],
    totalChapters: result.totalChapters,
    userContext: result.userContext ?? null,
  };
};
