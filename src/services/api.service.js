const config = require("../config");

exports.callApi = async ({method = 'GET', authorization = false, url, data, params = null}) => {
    console.log('=====url', config.apiUrl)
    let apiUrl = `${config.apiUrl}${url}`;

    if (params) {
        apiUrl = apiUrl + '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(apiUrl, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        ...(data ? {body: JSON.stringify(data)} : {})
    });
    const dataToSend = await res.json()
    console.log('=======')
    return dataToSend;
}
