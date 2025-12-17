import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    title: String,
    date: Date,
    location: String,
});

const EventModel = mongoose.models.Event || mongoose.model("Event", EventSchema);

export async function GET() {
    await connectDB();
    const events = await EventModel.find({}).lean();
    return NextResponse.json(events);
}

export async function POST(req: Request) {
    const body = await req.json();
    await connectDB();
    const created = await EventModel.create(body);
    return NextResponse.json(created);
}
