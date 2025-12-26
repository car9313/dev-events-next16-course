import ExploreBtn from "@/components/ExploreBtn";
import EventsGrid from "../components/EventsGrid";
import { Suspense } from "react";
import { CardsSkeleton } from "../components/skeletons";


export default async function Home() {
    return (
        <section>
            <div className="animate-fade-right-up">
                <h1 className="text-center">The Hub for Every Dev <br /> Event You Cant't Miss</h1>
                <p className="text-center mt-5"> Hackathons, Meetups, and Conferences, All In One Place</p>
                <ExploreBtn />

            </div>
            <Suspense fallback={<CardsSkeleton />}>
                <EventsGrid />
            </Suspense>
        </section>
    );
}
