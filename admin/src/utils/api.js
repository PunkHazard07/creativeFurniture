//fucnction to get stored tokens
const getStoredTokens =() => {
    return {
        accessToken: localStorage.getItem("token"),
        refreshToken: localStorage.getItem('refreshToken'),
    };
};

//function to refresh token
const refreshAccessToken = async () => {
    const { refreshToken } = getStoredTokens();
    if(!refreshToken){
        return null; //no refresh token available
    }

    try {
        const response = await fetch('http://localhost:8080/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken,
            }),
        })
            const data = await response.json();

            if(response.ok){
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                return data.accessToken;
            } else{
                return null; //refresh Failed
            }
    } catch (error) {
        console.error('error refreshing token:', error);
        return null;
    }
};

//function to make api requests with token refresh
const fetchWithAuth = async(url, options = {}) => {
    let { accessToken } = getStoredTokens();

    if (!options.headers) {
        options.headers = {};
    }

    options.headers['Authorization'] =`Bearer ${accessToken}`;

    let response =  await fetch(`http://localhost:8080/api${url}`, options);

    if(response.status === 401){
        //token expired, try to refresh it
        const newAccessToken = await refreshAccessToken();

        if(newAccessToken){
            //update the header with the new access token
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(`http://localhost:8080/api${url}`, options);
        } else{
            //logout userif refresh fails
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return null;
        }
    }
    //handle response safely
    try {
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('error parsing response:', error);
        throw new Error('invalid server response')
    }
}

export { fetchWithAuth};


