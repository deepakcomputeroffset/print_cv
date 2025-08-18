import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { uploadGroupBaseUrl } from "@/lib/urls";
import { uploadGroup } from "@prisma/client";

type ResponseType = { data: uploadGroup[] };

export async function fetchUploadGroups(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: uploadGroupBaseUrl,
        query: { ...params },
    });

    const { data } = await axios.get<ServerResponseType<ResponseType>>(url);
    return data;
}
