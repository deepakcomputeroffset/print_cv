import queryString from "query-string";
import axios from "axios";
import { QueryParams, ServerResponseType } from "@/types/types";
import { departmentBaseUrl } from "../urls";
import { taskType } from "@prisma/client";
import { z } from "zod";
import { taskTypeFormSchema } from "@/schemas/taskType.form.schema";

export async function fetchDepartments(params: QueryParams = {}) {
    const url = queryString.stringifyUrl({
        url: departmentBaseUrl,
        query: { ...params },
    });
    return await axios<
        ServerResponseType<
            QueryParams & {
                departments: taskType[];
            }
        >
    >(url);
}

export async function createDepartment(
    data: z.infer<typeof taskTypeFormSchema>,
) {
    return await axios.post<ServerResponseType<taskType>>(
        departmentBaseUrl,
        data,
    );
}
export async function updateDepartment(
    id: number,
    data: Partial<z.infer<typeof taskTypeFormSchema>>,
) {
    const url = `${departmentBaseUrl}/${id}`;
    return await axios.patch<ServerResponseType<taskType>>(url, data);
}

export async function deleteDepartment(id: number) {
    return await axios.delete(`${departmentBaseUrl}/${id}`);
}
