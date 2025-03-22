import NavbarLinks from "./nav";
import { auth } from "@/lib/auth";

export default async function Navbar() {
    const session = await auth();
    return (
        <section className="z-50 w-full sticky top-0">
            <div className="absolute inset-0 h-1 bg-gradient-to-r from-cyan-500 via-primary to-purple-500 z-10"></div>
            <NavbarLinks session={session} />
        </section>
    );
}
