import express from "express";

const port = 3000;
const app = express();
app.use(express.static("dist", { extensions: ["html"] }));
app.listen(3000, () =>
	console.log(`Server running on http://localhost:${port}`)
);
