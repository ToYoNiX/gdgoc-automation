import app from "./app.js"

const PORT = process.env.PORT ?? 3000;

// Starting our main application
app.listen(PORT, () => {
	console.log(`Application is starting up. would be available at port ${PORT}`);
})
