"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TRANSACTION_TYPE } from "@prisma/client";
import { useModal } from "@/hooks/use-modal";
import { Loader2 } from "lucide-react";
import { transactionFormSchema } from "@/schemas/transaction.form.schema";
import { Textarea } from "@/components/ui/textarea";
import { useWalletM } from "@/hooks/use-walletM";

export const TransactionForm = () => {
    const { onClose, data } = useModal();

    const form = useForm<z.infer<typeof transactionFormSchema>>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            customerId: data.customer?.id,
            amount: 0,
            type: "CREDIT",
            description: "",
        },
    });

    const {
        createTranction: { isPending, mutateAsync },
    } = useWalletM();

    const handleSubmit = async (
        values: z.infer<typeof transactionFormSchema>,
    ) => {
        await mutateAsync(values);
        onClose();
        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => handleSubmit(values))}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(v) =>
                                        field.onChange(parseInt(v.target.value))
                                    }
                                    type="number"
                                    min={0}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(TRANSACTION_TYPE).map(
                                        (t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={`w-full`} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "create"
                    )}
                </Button>
            </form>
        </Form>
    );
};
