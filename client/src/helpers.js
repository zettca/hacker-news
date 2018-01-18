import { resolve } from "url";
import { join } from "path";

const apiHost = process.env.REACT_APP_SERVER || "";

export function fetchAPI(resource, token) {
    const opts = {
        credentials: 'include',
        headers: new Headers({ "Authorization": "Bearer " + token })
    }
    const path = join("/api/", resource);
    return fetch(resolve(apiHost, path), token && opts)
        .then(res => res.json());
}
