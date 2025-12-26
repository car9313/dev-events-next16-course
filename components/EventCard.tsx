import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}
export default function EventCard({ title, image, slug, location, date, time }: EventCardProps) {
    console.log(image)
    console.log(title)
    return (
        <Link href={`/events/${slug}`} id="event-card" className="transition-transform duration-300 hover:scale-110">
            <Image src={image || "/placeholder.svg"} alt={title} width={410} height={300}
            />
            <div className="flex gap-2">
                <Image src="/icons/pin.svg" alt={location} width={14} height={14} />
                <p>{location}</p>
            </div>
            <p className="title">{title}</p>
            <div className="datetime">
                <>
                    <Image src="/icons/calendar.svg" alt={date} width={14} height={14} />
                    <p>{date}</p>
                </>
                <>
                    <Image src="/icons/clock.svg" alt={time} width={14} height={14} />
                    <p>{time}</p>
                </>
            </div>

        </Link>
    )
}
