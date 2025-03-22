import NavbarLinks from "./nav";
import { auth } from "@/lib/auth";

export default async function Navbar() {
    const session = await auth();
    return (
        // <section className="z-50 w-full shadow-sm">
        <NavbarLinks session={session} />
        // </section>
    );
}
