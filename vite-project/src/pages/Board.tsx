import KanbanBoard from "../components/board/KanbanBoard";

export default function Board() {
    return (
        <div>
            <h1 className="mb-4 text-xl font-semibold">Sprint Board</h1>
            <KanbanBoard />
        </div>
    );
}