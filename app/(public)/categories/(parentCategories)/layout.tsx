export default function CategoryLayout({
    children,
    recentorder,
}: {
    children: React.ReactNode;
    recentorder: React.ReactNode;
}) {
    return (
        <div className="mx-auto px-[5vw] container space-y-7">
            {children}
            {recentorder}
        </div>
    );
}
