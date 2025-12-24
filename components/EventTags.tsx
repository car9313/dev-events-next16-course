export default function EventTags({ tags }: { tags: string[] }) {
    return (
        <div className="flex-row-gap-2 flex-wrap p-4 border-t border-gray-700">
            {tags.map((tag) => (
                <div className="pill hover:scale-110 transition duration-300" key={tag}>
                    {tag}
                </div>
            ))}
        </div>
    )
}