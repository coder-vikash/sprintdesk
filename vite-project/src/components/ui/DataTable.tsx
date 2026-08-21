interface Column<T> {
    header: string;
    accessor: keyof T;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
}

export default function DataTable<T extends { id: string | number }>({
    columns,
    rows,
}: DataTableProps<T>) {
    return (
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="border-b text-left">
                    {columns.map((col) => (
                        <th key={String(col.accessor)} className="px-3 py-2 font-medium text-slate-600">
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                        {columns.map((col) => (
                            <td key={String(col.accessor)} className="px-3 py-2">
                                {String(row[col.accessor])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}