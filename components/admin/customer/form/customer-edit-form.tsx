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
import { useModal } from "@/hooks/use-modal";
import { useCustomers } from "@/hooks/use-customers";
import { getDirtyFieldsWithValues } from "@/lib/utils";

export const CustomerEditForm = () => {
    const { data, onClose } = useModal();
    const { data: states } = useStates();
    const { updateCustomer } = useCustomers();
    const customerFormSchemaUpdated = customerFormSchema?.partial();

    const form = useForm<z.infer<typeof customerFormSchemaUpdated>>({
        resolver: zodResolver(customerFormSchemaUpdated),
        defaultValues: {
            name: data?.customer?.name,
            businessName: data?.customer?.businessName,
            email: data?.customer?.email,
            country: data?.customer?.address?.city?.state?.countryId.toString(),
            state: data?.customer?.address?.city?.stateId?.toString(),
            city: data?.customer?.address?.cityId?.toString(),
            pinCode: data?.customer?.address?.pinCode,
            gstNumber: data?.customer?.gstNumber || undefined,
            line: data?.customer?.address?.line,
            phone: data?.customer?.phone,
            referenceId: data?.customer?.referenceId?.toString(),
        },
    });

    const formData = form.watch();
    const dirtyFields = form.formState.dirtyFields;

    const dirtyFieldsWithValues = getDirtyFieldsWithValues(
        dirtyFields,
        formData,
    );

    const onSubmit = () => {
        if (
            Object.keys(dirtyFieldsWithValues).length > 0 &&
            data?.customer?.id
        ) {
            updateCustomer.mutateAsync({
                id: data?.customer?.id,
                data: dirtyFieldsWithValues,
            });
        }
        onClose();
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
                                <Input placeholder="Abc" {...field} />
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
                                <Input placeholder="Radhe Radhe" {...field} />
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
                                <Input placeholder="Optional" {...field} />
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Upated
                </Button>
            </form>
        </Form>
    );
};
