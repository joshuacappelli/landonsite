import { deleteNewsletterUser } from "@/app/db/queries";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idInt = parseInt(id);

    try {
        await deleteNewsletterUser(idInt);
        return NextResponse.json({ message: 'Newsletter user deleted successfully' });
    } catch (error) {
        console.error('Error deleting newsletter user:', error);
        return NextResponse.json(
            { error: 'Failed to delete newsletter user' },
            { status: 500 }
        );
    }

}