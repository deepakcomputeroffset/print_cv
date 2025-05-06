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
import { motion } from "motion/react";
import {
    Building,
    User,
    MapPin,
    Mail,
    Phone,
    Hash,
    Home,
    Save,
} from "lucide-react";
import { customerCategory } from "@prisma/client";
import { useCustomerCategory } from "@/hooks/use-customer-category";

export const CustomerEditForm = ({ customer }: { customer?: customerType }) => {
    const { data: states } = useStates();
    const router = useRouter();
    const {
        updateCustomer: { isPending, mutateAsync },
    } = useCustomers();
    const { customersCategory } = useCustomerCategory();
    const customerFormSchemaUpdated = customerFormSchema?.partial();
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
            customerCategoryId: customer?.customerCategoryId || 0,
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
            customerCategoryId: customer?.customerCategoryId || 0,
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
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100 mb-2">
                    <h3 className="text-gray-700 font-medium mb-4">
                        Account Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        Business Name
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="Your business"
                                                {...field}
                                                disabled
                                                className="w-full pl-10 py-5 bg-gray-100 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        Your Name
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="Your name"
                                                {...field}
                                                disabled
                                                className="w-full pl-10 py-5 bg-gray-100 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="your.email@example.com"
                                                {...field}
                                                className="w-full pl-10 py-5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        Phone Number
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="Your phone number"
                                                {...field}
                                                disabled
                                                className="w-full pl-10 py-5 bg-gray-100 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-gray-700 font-medium mb-4">
                        Shipping Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        State
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(e) => {
                                                form.setValue("city", "");
                                                field.onChange(e);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="py-5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
                                                <div className="flex items-center">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                    <SelectValue
                                                        placeholder={
                                                            "Select state"
                                                        }
                                                    />
                                                </div>
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
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        City
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="py-5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
                                                <div className="flex items-center">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                    <SelectValue
                                                        placeholder={
                                                            "Select city"
                                                        }
                                                    />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        City
                                                    </SelectLabel>
                                                    {states?.map((state) => {
                                                        if (
                                                            state?.id?.toString() ==
                                                            form?.getValues(
                                                                "state",
                                                            )
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
                                                                        {
                                                                            city?.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            );
                                                        }
                                                    })}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                        <FormField
                            control={form.control}
                            name="pinCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        Pin Code
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="123456"
                                                {...field}
                                                className="w-full pl-10 py-5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gstNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        GST Number
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="Optional"
                                                {...field}
                                                disabled
                                                className="w-full pl-10 py-5 bg-gray-100 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-5">
                        <FormField
                            control={form.control}
                            name="line"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600 font-medium">
                                        Address
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <Input
                                                placeholder="Enter your address"
                                                {...field}
                                                className="w-full pl-10 py-5 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="customerCategoryId"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value?.toString()}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={"Select Category"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Categories
                                            </SelectLabel>
                                            {customersCategory?.map(
                                                (ccat: customerCategory) => (
                                                    <SelectItem
                                                        key={ccat?.id}
                                                        value={ccat?.id?.toString()}
                                                    >
                                                        {ccat?.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <motion.div
                    className="pt-4"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white py-6 rounded-lg text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        disabled={isPending || !form.formState.isDirty}
                    >
                        {isPending ? (
                            <span className="flex items-center">
                                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                Updating Profile...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </span>
                        )}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
};
