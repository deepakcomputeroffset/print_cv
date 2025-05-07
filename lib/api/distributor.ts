import axios from "axios";
import { distributorBaseUrl } from "../urls";
import { ServerResponseType, staffType } from "@/types/types";

export const getDistributorByCity = async (cityId: number) => {
    const { data } = await axios<ServerResponseType<staffType[]>>(
        `${distributorBaseUrl}/city/${cityId}`,
    );
    return data;
};
