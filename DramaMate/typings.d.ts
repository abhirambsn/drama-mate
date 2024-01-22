type SearchResultsDramas = {
    link: string;
    title: string;
    image: string;
}

type JSONResponse = {
    code: number;
    data: any;
    error: null | any;
    message?: string;
    status: string;
}

type DramaInfo = {
    name: string;
    thumbnail: string;
    native_title: string;
    genre: string;
    score: string;
    aka: string[],
    date: string;
    synopsis: string;
    type: string;
    cast: string[];
    country: string;
    duration: string;
}

type Recommendation = {
    genre: string;
    link: string;
    title: string;
    image: string;
}

type DramaDetailRouteParams = {
    title: string;
    image: string;
    link: string;
    recommended_by: string | null;
}

type WatchListData = {
    link: string;
    state: 'COMPLETE' | 'WATCHING' | 'PLANNED';
    name: string;
    image: string;
    recommended_by: string | null
}

type WatchListResponse = {
    id: string;
    user_id: string;
    watch_list: WatchListData[];
}