export function fetchAuthed(url, jwt) {
    const opts = {
        credentials: 'include',
        headers: new Headers({ "Authorization": "Bearer " + jwt })
    }
    return fetch(url, jwt && opts);
}
