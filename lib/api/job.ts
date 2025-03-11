import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { jobBaseUrl } from "../urls";
import { job, order, task } from "@prisma/client";
import { z } from "zod";
import { jobFormSchema } from "@/schemas/job.form.schema";
import { taskSchema } from "@/schemas/task.form.schema";

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

export async function jobVerification(id: number) {
    return await axios.post<ServerResponseType<job>>(
        `${jobBaseUrl}/${id}/verification`,
    );
}

export async function removeOrderFromJob(id: number, orderId: number) {
    return await axios.post<ServerResponseType<order>>(
        `${jobBaseUrl}/${id}/orders/remove`,
        { orderId },
    );
}

export async function createTask(
    jobId: number,
    data: z.infer<typeof taskSchema>,
) {
    return await axios.post<ServerResponseType<task>>(
        `${jobBaseUrl}/${jobId}/tasks`,
        data,
    );
}
