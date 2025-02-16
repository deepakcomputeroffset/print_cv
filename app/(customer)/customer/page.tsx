import { auth } from "@/lib/auth";

export default async function CustomerDashboard() {
    const session = await auth();

    return (
        <div>
            <h1>Customer Dashboard</h1>
            <p>{session?.user?.customer?.name}</p>
        </div>
    );
}
