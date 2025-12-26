import { notFound } from "next/navigation";
import { IEvent } from "../../../database/event.model";
import Image from "next/image";
import EventDetails from "../../../components/EventDetails";
import EventAgenda from "../../../components/EventAgenda";
import EventTags from "../../../components/EventTags";
import BookEvent from "../../../components/BookEvent";
import { Suspense } from "react";
import { getSimilarEventsBySlug } from "../../../lib/actions/event.actions";
import EventCard from "../../../components/EventCard";

type RouteParams = {
    params: Promise<{ slug: string }>
}
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function EventDetailsPage({ params }: RouteParams) {
    let event;
    const { slug } = await params;
    const bookings = 10;
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
    try {
        const response = await fetch(`${BASE_URL}/api/events/${slug}`)

        if (!response.ok) {
            if (response.status === 404) {
                return notFound();
            }
            throw new Error(`Failed to fetch event: ${response.statusText}`);
        }

        const data = await response.json()
        event = data.event as IEvent
        console.log(event)
        if (!event) return notFound()


    } catch (error) {
        console.error('Error fetching event:', error);
        return notFound();

    }
    return (
        <Suspense fallback={<p>Cargando</p>}>
            <section id="event" className="animate-fade-in-up">
                <div className="header">
                    <h1>Event Details :<br /> {slug}</h1>
                    <p className="mt-2">{event.description}</p>
                </div>
                <div className="details">
                    <div className="content">
                        <Image
                            src={event.image}
                            alt="Event Banner"
                            width={410}
                            height={300}
                            className="banner"
                        />
                        <div className="flex flex-col gap-2 p-4 border-t border-gray-700">
                            <h2>Overview</h2>
                            <p>{event.overview}</p>
                        </div>
                        <div className="flex flex-col gap-2 p-4 border-t border-gray-700">
                            <h2>Event Details</h2>
                            <EventDetails icon="/icons/calendar.svg"
                                alt="calendar"
                                label={event.date}
                            />
                            <EventDetails icon="/icons/clock.svg"
                                alt="clock"
                                label={event.time} />
                            <EventDetails icon="/icons/pin.svg"
                                alt="pin"
                                label={event.location} />

                            <EventDetails icon="/icons/mode.svg"
                                alt="mode"
                                label={event.mode} />

                            <EventDetails icon="/icons/audience.svg"
                                alt="audience"
                                label={event.audience} />
                        </div>
                        <EventAgenda agendaItems={event.agenda} />
                        <div className="flex-col-gap-2 p-4 border-t border-gray-700">
                            <h2>About the Organizer</h2>
                            <p>{event.organizer}</p>
                        </div>
                        <EventTags tags={event.tags} />
                    </div>
                    <aside className="booking">
                        <div className="signup-card">
                            <h2>Book Your Spot</h2>
                            {bookings > 0 ? (
                                <p className="text-sm">
                                    Join {bookings} people who have already booked their spot!
                                </p>
                            ) : (
                                <p className="text-sm">Be the first to book your spot!</p>
                            )}

                            <BookEvent eventId={event._id.toString()} slug={event.slug} />
                        </div>
                    </aside>
                </div>
                <div className="flex w-full flex-col md:flex-row  gap-10 mt-20">
                    {
                        similarEvents.length > 0 && similarEvents.map(
                            (similarEvent: IEvent) => (
                                <EventCard key={similarEvent.title}
                                    image={similarEvent.image}
                                    title={similarEvent.title}
                                    slug={similarEvent.slug}
                                    location={similarEvent.location}
                                    date={similarEvent.date}
                                    time={similarEvent.time}
                                />
                            )
                        )
                    }
                </div>
            </section>
        </Suspense>
    )
}