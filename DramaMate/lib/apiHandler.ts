const BASE_URL = "http://localhost:8000/api/v1";

export const searchDramas = async (query: string, access_token: string) => {
  const url = `${BASE_URL}/all?language=japanese&type=drama&q=${query}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const json = (await resp.json()) as JSONResponse;
  return json.data as SearchResultsDramas[];
};

export const getDramaInfo = async (url: string, access_token: string) => {
  const req_uri = `${BASE_URL}/info`;
  const body = {
    link: url,
  };
  const resp = await fetch(req_uri, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = (await resp.json()) as JSONResponse;
  return json.data as DramaInfo;
};

export const fetchRecommendations = async (
  title: string,
  lang: string,
  type: string,
  num: number,
  access_token: string
) => {
  const body = {
    title,
    language: lang,
    genre: ["thriller"],
    type,
    num,
  };

  const url = `${BASE_URL}/recommend`;
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = (await resp.json()) as JSONResponse;
  if (json.code !== 200) {
    return [] as Recommendation[];
  }
  return json.data as Recommendation[];
};

export const fetchWatchlist = async (access_token: string) => {
  const url = `${BASE_URL}/list`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const json = (await resp.json()) as JSONResponse;
  const watchlist = json.data as WatchListResponse;
  return watchlist.watch_list as WatchListData[];
};

export const insertToWatchlist = async (
  link: string,
  state: "COMPLETE" | "PLANNED" | "WATCHING",
  name: string,
  image: string,
  recommended_by: string | null,
  access_token: string
) => {
  const url = `${BASE_URL}/list`;
  const body = {
    link,
    state,
    image,
    name,
    recommended_by,
  };
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = (await resp.json()) as JSONResponse;
  return json;
};

export const removeFromWatchlist = async (
  link: string,
  access_token: string
) => {
  const url = `${BASE_URL}/list`;
  const body = {
    link,
  };
  const resp = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = (await resp.json()) as JSONResponse;
  return json;
};

export const clearWatchlist = async (access_token: string) => {
  const url = `${BASE_URL}/clear`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const json = (await resp.json()) as JSONResponse;
  return json;
};
