import axios from "axios";
import { tasksBaseUrl } from "../urls";
import { ServerResponseType } from "@/types/types";
import { job, task, taskType } from "@prisma/client";

export const fetchTasks = async () => {
    return axios<
        ServerResponseType<
            (task & {
                job: job;
                taskType: taskType;
            })[]
        >
    >(tasksBaseUrl);
};

export const reassignTask = async (taskId: number, staffId: number) => {
    return axios.patch<ServerResponseType<task>>(
        `${tasksBaseUrl}/${taskId}/reassign`,
        {
            staffId,
        },
    );
};
