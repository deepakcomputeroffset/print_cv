import { auth } from "@/lib/auth";

export default async function CustomerDashboard() {
    const session = await auth();
    console.log("from customer, ",session?.user.customer)
    return (
        <div>
            <h1>Customer Dashboard</h1>
        </div>
    );
}
