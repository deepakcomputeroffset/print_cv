"use client";

// Core React and state management
import { useState } from "react";

// Zod for schema validation
import { z } from "zod";

// React Hook Form for form state management
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Lucide icons
import { Calculator, X } from "lucide-react";

// Shadcn/ui components - assuming these are in your project structure
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define the validation schema with Zod
const formSchema = z.object({
    width: z.coerce
        .number({ required_error: "Width is required." })
        .positive("Width must be a positive number."),
    height: z.coerce
        .number({ required_error: "Height is required." })
        .positive("Height must be a positive number."),
    sheets: z.coerce
        .number({ required_error: "Number of sheets is required." })
        .int("Must be a whole number.")
        .positive("Sheets must be a positive number."),
    weight: z.coerce
        .number({ required_error: "Weight is required." })
        .positive("Weight must be a positive number."),
    unit: z.string(),
});

// The main component
export default function PaperGsmCalculatorThemed() {
    // State for the calculated result and any specific logical errors
    const [gsm, setGsm] = useState<number | null>(null);
    const [error, setError] = useState("");

    // Set up the form using React Hook Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit: "inches",
            width: undefined,
            height: undefined,
            sheets: undefined,
            weight: undefined,
        },
    });

    // The submit handler, called only on successful validation
    function onSubmit(values: z.infer<typeof formSchema>) {
        setError("");
        setGsm(null);

        const { width, height, sheets, weight, unit } = values;

        let widthInMeters;
        let heightInMeters;

        switch (unit) {
            case "mm":
                widthInMeters = width / 1000;
                heightInMeters = height / 1000;
                break;
            case "cm":
                widthInMeters = width / 100;
                heightInMeters = height / 100;
                break;
            case "inches":
            default:
                widthInMeters = width * 0.0254;
                heightInMeters = height * 0.0254;
                break;
        }

        const areaOfOneSheet = widthInMeters * heightInMeters;
        const totalArea = areaOfOneSheet * sheets;
        const weightInGrams = weight * 1000;

        if (totalArea === 0) {
            setError(
                "The calculated area is zero. Please check width and height.",
            );
            return;
        }

        const calculatedGsm = weightInGrams / totalArea;
        setGsm(Number(calculatedGsm.toFixed(2)));
    }

    // Resets the form and results
    const handleReset = () => {
        form.reset();
        setGsm(null);
        setError("");
    };

    return (
        <section className="relative w-full flex items-center justify-center p-4 bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-70" />
                <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl opacity-70" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <Card className="bg-card/70 backdrop-blur-xl border shadow-2xl shadow-primary/10 rounded-2xl">
                    <CardHeader className="text-center p-5">
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-card-foreground">
                            Paper GSM Calculator
                        </CardTitle>
                        <CardDescription className="pt-1 text-sm">
                            Calculate the Grams per Square Meter (GSM) of paper.
                        </CardDescription>
                        <div className="flex justify-center pt-3">
                            <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                        </div>
                    </CardHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="grid gap-4 px-5">
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Unit *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-background/50">
                                                        <SelectValue placeholder="Select a unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="inches">
                                                        Inches
                                                    </SelectItem>
                                                    <SelectItem value="mm">
                                                        Millimeters (mm)
                                                    </SelectItem>
                                                    <SelectItem value="cm">
                                                        Centimeters (cm)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="width"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paper Width *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 8.5"
                                                        className="bg-background/50"
                                                        min={0}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Paper Height *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 11"
                                                        className="bg-background/50"
                                                        min={0}
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
                                    name="sheets"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Number of Sheets *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Total weighed sheets"
                                                    className="bg-background/50"
                                                    min={0}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Weight (in KGs) *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 2.5"
                                                    className="bg-background/50"
                                                    min={0}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>

                            <CardFooter className="flex-col sm:flex-row gap-2 p-5">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full flex-grow bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground shadow-lg hover:shadow-xl group transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    <Calculator className="mr-2 h-4 w-4 relative z-10" />
                                    <span className="relative z-10">
                                        Calculate GSM
                                    </span>
                                </Button>
                                <Button
                                    type="button"
                                    size="lg"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="w-full sm:w-auto"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>

                    {/* Result Display */}
                    {gsm !== null && (
                        <div className="px-5 pb-5">
                            <div className="bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                                <p className="text-sm">Calculated Paper GSM</p>
                                <p className="text-4xl font-bold tracking-tight">
                                    {gsm}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    g/m²
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="px-5 pb-5">
                            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-sm text-center">
                                {error}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </section>
    );
}
