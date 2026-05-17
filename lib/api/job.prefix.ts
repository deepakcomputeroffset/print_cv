import axios from "axios";
import { ServerResponseType } from "@/types/types";
import { jobPrefixBaseUrl } from "../urls";
import { z } from "zod";
import { jobPrefixFormSchema } from "@/schemas/job.form.schema";

export async function fetchJobPrefixes() {
    return await axios<ServerResponseType<{ id: number; prefix: string; createdAt: string }[]>>(
        jobPrefixBaseUrl,
    );
}

export async function createJobPrefix(
    data: z.infer<typeof jobPrefixFormSchema>,
) {
    return await axios.post<
        ServerResponseType<{ id: number; prefix: string }>
    >(jobPrefixBaseUrl, data);
}

export async function deleteJobPrefix(id: number) {
    return await axios.delete<ServerResponseType<null>>(
        `${jobPrefixBaseUrl}/${id}`,
    );
}
