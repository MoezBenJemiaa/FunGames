const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const loginRoute = require("./routes/loginRoute");
const connectDB = require("./db");

const app = express();
const PORT = 5000;

app.use(cors()); // ✅ Allow all origins by default
app.use(express.json());

connectDB();
app.use("/login", loginRoute);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
