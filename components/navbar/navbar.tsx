import NavbarLinks from "./nav";

export default async function Navbar() {
    return (
        <section className="z-50 w-full sticky top-0">
            <div className="absolute inset-0 h-1 bg-gradient-to-r from-cyan-500 via-primary to-purple-500 z-10"></div>
            <NavbarLinks />
        </section>
    );
}
