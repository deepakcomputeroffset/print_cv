export default async function ViewProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <div>View Product Page - {id}</div>;
}
