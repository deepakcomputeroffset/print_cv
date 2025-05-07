import queryString from "query-string";
import axios from "axios";
import { z } from "zod";
import { staffFormSchema } from "@/schemas/staff.form.schema";
import { QueryParams, ServerResponseType, staffType } from "@/types/types";
import { staffBaseUrl } from "../urls";
import { staff } from "@prisma/client";
import { defaultStaffPerPage } from "../constants";

export async function fetchStaffs(
    params: QueryParams = {
        page: 1,
        perpage: defaultStaffPerPage,
        search: "",
        sortorder: "asc",
    },
) {
    const url = queryString.stringifyUrl({
        url: staffBaseUrl,
        query: { ...params },
    });
    const { data } =
        await axios<ServerResponseType<QueryParams & { staff: staffType[] }>>(
            url,
        );
    return data.data;
}

export async function updatestaff(
    id: number,
    data: Partial<z.infer<typeof staffFormSchema>>,
) {
    const url = `${staffBaseUrl}/${id}`;
    const { data: response } = await axios.patch<ServerResponseType<staff>>(
        url,
        data,
    );
    return response.data;
}

export async function createstaff(data: z.infer<typeof staffFormSchema>) {
    const { data: response } = await axios.post<ServerResponseType<staff>>(
        staffBaseUrl,
        data,
    );
    return response.data;
}

export async function togglestaffBan(id: number) {
    const url = `${staffBaseUrl}/${id}/ban`;
    const { data } = await axios.post<ServerResponseType<staff>>(url);
    return data.data;
}

export async function deletestaff(id: number) {
    const url = `${staffBaseUrl}/${id}`;
    const { data } = await axios.delete<ServerResponseType<null>>(url);
    return data;
}
