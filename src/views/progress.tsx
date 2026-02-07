interface process_parameters {
	"name": string,
	"length": number,
	"downloaded": number,
}

export default function progress(parameters:process_parameters) {
	return (
		<div>
			{parameters["name"]} - progress: {Math.floor((parameters["downloaded"] / parameters["length"]) * 100)}%
		</div>
	)
}
