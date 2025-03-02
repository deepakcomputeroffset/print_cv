import { customerType, QueryParams, ServerResponseType } from "@/types/types";
import queryString from "query-string";
import { walletMBaseUrl } from "../urls";
import axios from "axios";
import { customer, transaction, wallet } from "@prisma/client";
import { z } from "zod";
import { transactionFormSchema } from "@/schemas/transaction.form.schema";

export const fetchWallets = async (params: QueryParams = {}) => {
    const url = queryString.stringifyUrl({
        url: walletMBaseUrl,
        query: { ...params },
    });
    const { data } = await axios<
        ServerResponseType<
            QueryParams & {
                customers: customerType[];
            }
        >
    >(url);
    return data.data;
};

export const fetchWallet = async (params: QueryParams = {}) => {
    const url = queryString.stringifyUrl({
        url: `${walletMBaseUrl}/${params.walletId}`,
        query: { ...params },
    });
    const { data } = await axios<
        ServerResponseType<
            QueryParams & {
                wallet: wallet & {
                    customer: Omit<customer, "password">;
                };
                transactions: (transaction & {
                    staff: {
                        id: number;
                        name: string;
                    };
                })[];
            }
        >
    >(url);
    return data.data;
};

export async function fetchCustomerByWalletid(id: string | number) {
    return await axios<
        ServerResponseType<
            Omit<customer, "password"> & {
                wallet: { balance: number; id: number };
            }
        >
    >(`${walletMBaseUrl}/${id}/customer`);
}

export async function createTransaction(
    data: z.infer<typeof transactionFormSchema>,
) {
    const { data: response } = await axios.post<
        ServerResponseType<customerType>
    >(walletMBaseUrl, data);
    return response;
}
