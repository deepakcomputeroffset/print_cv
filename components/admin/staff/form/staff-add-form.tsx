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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { staffFormSchema } from "@/schemas/staff.form.schema";
import { ROLE } from "@prisma/client";
import { useModal } from "@/hooks/use-modal";
import { useStaff } from "@/hooks/use-staff";
import { Loader2 } from "lucide-react";
import { useStates } from "@/hooks/useStates";

export const AddStaffForm = () => {
    const { onClose } = useModal();
    const { data: states } = useStates();
    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            country: "india",
            state: "",
            city: "",
            pinCode: "",
            line: "",
            role: "STAFF",
        },
    });

    const {
        createStaff: { mutateAsync, isPending },
    } = useStaff();
    const handleSubmit = async (values: z.infer<typeof staffFormSchema>) => {
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Abc" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="example@gmail.com"
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
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="1234567890"
                                    {...field}
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Abc123@@"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(ROLE).map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
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
