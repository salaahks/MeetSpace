import RoomDetail from "./RoomDetail"

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <RoomDetail roomId={Number(id)} />
}
