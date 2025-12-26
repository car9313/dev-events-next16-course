import { IEvent } from "../database/event.model"
import EventCard from "./EventCard"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function EventsGrid() {
    const response = await fetch(`${BASE_URL}/api/events`)
    const { events } = await response.json()

    return (
        <div className="mt-20 space-y-7">
            <h3>Feactured Events</h3>
            <ul className="events list-none">
                {
                    events && events.length > 0 && (events as IEvent[]).map((event) => (
                        <li key={event.title} className="animate-fade-in-up flex justify-center items-center">
                            <EventCard {...event} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}