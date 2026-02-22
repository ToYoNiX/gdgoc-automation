import type { process_parameters } from "../common/types.js";

export default function progress(id: string, parameters: process_parameters): JSX.Element {
  const percent =
    parameters.length > 0
      ? Math.floor((parameters.downloaded / parameters.length) * 100)
      : 0;

  const isComplete = percent >= 100;

  return (
    <div
      id={`process-${id}`}
      hx-get={`/records/progress/${id}`}
      hx-target={`#process-${id}`}
      hx-trigger={isComplete ? undefined : "every 2s"}
      hx-swap="outerHTML"
    >
      {parameters.name} - {isComplete ? "Complete" : `Progress: ${percent}%`}
    </div>
  );
}