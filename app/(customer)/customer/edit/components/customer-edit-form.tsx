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
import { Input } from "@/components/ui/input";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useStates } from "@/hooks/useStates";
import { useCustomers } from "@/hooks/use-customers";
import { getDirtyFieldsWithValues } from "@/lib/utils";
import { customerType } from "@/types/types";
import { useRouter } from "next/navigation";

export const CustomerEditForm = ({ customer }: { customer?: customerType }) => {
    const { data: states } = useStates();
    const router = useRouter();
    const {
        updateCustomer: { isPending, mutateAsync },
    } = useCustomers();
    const customerFormSchemaUpdated = customerFormSchema?.partial();
    console.log(customer);
    const form = useForm<z.infer<typeof customerFormSchemaUpdated>>({
        resolver: zodResolver(customerFormSchemaUpdated),
        defaultValues: {
            name: customer?.name,
            businessName: customer?.businessName,
            email: customer?.email,
            country: customer?.address?.city?.state?.countryId.toString(),
            state: customer?.address?.city?.stateId?.toString(),
            city: customer?.address?.cityId?.toString(),
            pinCode: customer?.address?.pinCode,
            gstNumber: customer?.gstNumber || undefined,
            line: customer?.address?.line,
            phone: customer?.phone,
        },
        values: {
            name: customer?.name,
            businessName: customer?.businessName,
            email: customer?.email,
            country: customer?.address?.city?.state?.countryId.toString(),
            state: customer?.address?.city?.stateId?.toString(),
            city: customer?.address?.cityId?.toString(),
            pinCode: customer?.address?.pinCode,
            gstNumber: customer?.gstNumber || undefined,
            line: customer?.address?.line,
            phone: customer?.phone,
        },
    });

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;

    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );

    const onSubmit = () => {
        if (Object.keys(dirtyFieldsWithValues).length > 0 && customer?.id) {
            mutateAsync({ id: customer?.id, data: dirtyFieldsWithValues });
            router.push("/customer");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Abc" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Radhe Radhe"
                                    {...field}
                                    disabled
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-wrap gap-2">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(e) => {
                                            form.setValue("city", "");
                                            field.onChange(e);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={"Select state"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    States
                                                </SelectLabel>
                                                {states?.map((state) => (
                                                    <SelectItem
                                                        key={state?.id}
                                                        value={state?.id.toString()}
                                                    >
                                                        {state?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={"Select city"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>city</SelectLabel>

                                                {states?.map((state) => {
                                                    if (
                                                        state?.id?.toString() ==
                                                        form?.getValues("state")
                                                    ) {
                                                        return state?.cities?.map(
                                                            (city: {
                                                                id: number;
                                                                name: string;
                                                            }) => (
                                                                <SelectItem
                                                                    key={
                                                                        city?.id
                                                                    }
                                                                    value={city?.id?.toString()}
                                                                >
                                                                    {city?.name}
                                                                </SelectItem>
                                                            ),
                                                        );
                                                    }
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Pin code</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="line"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Sector-8, Noida"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gstNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GST Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Optional"
                                    {...field}
                                    disabled
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-wrap gap-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="+911234567890"
                                        {...field}
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || !form.formState.isDirty}
                >
                    {isPending ? "Updating..." : "Update"}
                </Button>
            </form>
        </Form>
    );
};
