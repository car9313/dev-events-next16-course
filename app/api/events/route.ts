import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Event, { IEvent } from "@/database/event.model";
import { uploadToImageKit } from "../../../lib/imagekit-upload";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const date = formData.get('date');

        if (!title || !description || !date) {
            return NextResponse.json(
                { message: 'Missing required fields: title, description, and date are required' },
                { status: 400 }
            );
        }


        // 1️⃣ Archivo
        const file = formData.get('image');
        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: 'Image is required' },
                { status: 400 }
            );
        }

        const uploadResult = await uploadToImageKit(file);

        // 2️⃣ Arrays (FORMA ÚNICA Y CLARA)
        const agenda = formData
            .getAll('agenda')
            .filter(v => typeof v === 'string')
            .map(v => v.trim())
            .filter(Boolean);

        const tags = formData
            .getAll('tags')
            .filter(v => typeof v === 'string')
            .map(v => v.trim())
            .filter(Boolean);

        // 3️⃣ DTO (adaptador)
        const eventDTO = {
            title: title as string,
            description: description as string,
            overview: (formData.get('overview') as string) ?? '',
            venue: (formData.get('venue') as string) ?? '',
            location: (formData.get('location') as string) ?? '',
            date: date as string,
            time: (formData.get('time') as string) ?? '',
            mode: (formData.get('mode') as string) ?? '',
            audience: (formData.get('audience') as string) ?? '',
            organizer: (formData.get('organizer') as string) ?? '',
            image: uploadResult.url,
            agenda,
            tags
        };

        // 4️⃣ Persistencia (Domain + DB)
        const createdEvent = await Event.create(eventDTO);

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
                message: 'Event creation failed',
                error: error.message
            },
            { status: 500 }
        );
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