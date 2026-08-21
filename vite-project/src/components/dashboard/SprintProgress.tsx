import type { Sprint } from "../../types/sprint";

interface SprintProgressProps {
  sprint: Sprint | undefined;
  progress: number;
}

export default function SprintProgress({ sprint, progress }: SprintProgressProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Active Sprint
      </h3>

      {!sprint ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">No sprint currently active.</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            {sprint.name} · {sprint.startDate} → {sprint.endDate}
          </p>

          <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Completion</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}