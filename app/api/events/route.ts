import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Event from "@/database/event.model";
import { uploadToImageKit } from "../../../lib/imagekit-upload";

export async function POST(req: NextRequest) {

    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );
        }
        let event;
        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 });
        }
        const uploadResult = await uploadToImageKit(file);
        const imageUrl = uploadResult.url;
        const eventData: any = { ...event, image: imageUrl };
        if (typeof eventData.agenda === 'string') {
            try {
                eventData.agenda = JSON.parse(eventData.agenda);
            } catch (e) {
                eventData.agenda = eventData.agenda.split('\n').filter((line: string) => line.trim());
            }
        }
        if (typeof eventData.tags === 'string') {
            try {
                eventData.tags = JSON.parse(eventData.tags);
            } catch (e) {
                console.warn('No se pudo parsear tags como JSON, usando como array simple');
                eventData.tags = eventData.tags.split(',').map((tag: string) => tag.trim());
            }
        }
        const createdEvent = await Event.create(eventData);
        return NextResponse.json(
            {
                message: 'Event created successfully',
                event: createdEvent
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                message: 'Event Creation Failed',
                error: error.message,
                // Solo en desarrollo mostrar detalles
                ...(process.env.NODE_ENV === 'development' && {
                    stack: error.stack,
                    details: error.toString()
                })
            },
            { status: 500 }
        );
    } finally {
        console.log('=== FIN POST /api/events ===');
    }
}


// Opcional: Agregar método GET para probar
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const events = await Event.find({}).sort({ createdAt: -1 });
        return NextResponse.json({
            message: "Events fetched successfully",
            events
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Error fetching events',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}