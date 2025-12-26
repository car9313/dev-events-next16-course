export default function EventAgenda({ agendaItems }: {
    agendaItems: string[]
}) {
    return (
        <div className="agenda p-4 border-t border-gray-700">
            <h2>Agenda</h2>
            <ul>
                {agendaItems.map(item => (
                    <li key={item}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}