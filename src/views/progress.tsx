import type { process_parameters } from "../common/types.js";

export default function progress(parameters: process_parameters) {
  return (
    <div>
      {parameters["name"]} - progress:{" "}
      {Math.floor((parameters["downloaded"] / parameters["length"]) * 100)}%
    </div>
  );
}
