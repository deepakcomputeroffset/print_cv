import NavbarLinks from "./nav";
import { auth } from "@/lib/auth";

export default async function Navbar() {
    const session = await auth();
    return (
        <section className="sticky top-0 z-50 w-full">
            <NavbarLinks session={session} />
        </section>
    );
}
