export const getTokensFromURLFragment = (url: string) => {
    const params = new URLSearchParams(url.split("#")[1]);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const expiresIn = params.get("expires_in");
    const tokenType = params.get("token_type");
    return { accessToken, refreshToken, expiresIn, tokenType };
}