import axios from "axios";

import { config } from "./config";

export async function getFifaApi(url: string) {
    return await axios.get(
        url, {
            headers: {
                Authorization: config.api.fifaKey,
            }
        }
    )
}

export async function postFifaApi(url: string, body: object) {
    return await axios.post(
        url, body, {
            headers: {
                Authorization: config.api.fifaKey,
            }
        }
    )
}