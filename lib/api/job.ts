import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { jobBaseUrl } from "../urls";
import { job } from "@prisma/client";
import { z } from "zod";
import { jobFormSchema } from "@/schemas/job.form.schema";

export async function fetchJobs(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: jobBaseUrl,
        query: { ...params },
    });
    return await axios<
        ServerResponseType<
            QueryParams & {
                jobs: job[];
            }
        >
    >(url);
}

export async function createJob(data: z.infer<typeof jobFormSchema>) {
    return await axios.post<ServerResponseType<job>>(jobBaseUrl, data);
}
export async function updateJob(
    id: number,
    data: Partial<z.infer<typeof jobFormSchema>>,
) {
    const url = `${jobBaseUrl}/${id}`;
    return await axios.patch<ServerResponseType<job>>(url, data);
}

export async function deleteJob(id: number) {
    return await axios.delete<ServerResponseType<null>>(`${jobBaseUrl}/${id}`);
}
