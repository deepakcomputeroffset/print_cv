import { QueryParams } from "@/types/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Upload, AlertCircle } from "lucide-react";
import { EmailReviewTab } from "./components/EmailReviewTab";
import { FileReviewTab } from "./components/FileReviewTab";
import { ImproperOrderTab } from "./components/ImproperOrderTab";

export default async function ReviewPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Review Orders</h1>
            </div>

            <Tabs defaultValue="email" className="space-y-4">
                <TabsList>
                    <TabsTrigger
                        value="email"
                        className="flex items-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger
                        value="file"
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Uploads
                    </TabsTrigger>
                    <TabsTrigger
                        value="improper"
                        className="flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" />
                        Improper Orders
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                    <EmailReviewTab searchParams={searchParams} />
                </TabsContent>

                <TabsContent value="file">
                    <FileReviewTab searchParams={searchParams} />
                </TabsContent>

                <TabsContent value="improper">
                    <ImproperOrderTab searchParams={searchParams} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
