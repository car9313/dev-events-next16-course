import Image from "next/image";

interface EventDetailsProps {
    icon: string;
    alt: string;
    label: string;
}

export default function EventDetails({ icon, alt, label }: EventDetailsProps) {
    return (
        <div className="flex-row-gap-2">
            <Image src={icon} alt={alt} width={17}
                height={17}
            />
            <p>
                {label}
            </p>
        </div>
    )
}