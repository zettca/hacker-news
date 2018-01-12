export function fetchDataWithJWT(url, jwt) {
    const opts = {
        credentials: 'include',
        headers: new Headers({ "Authorization": "Bearer " + jwt })
    }
    return fetch(url, jwt && opts)
        .then(res => res.json())
        .catch(err => console.log(err));
}
