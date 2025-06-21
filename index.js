const express = require("express");
const path = require("path");
const csvRoutes = require("./src/routes/csvRoutes");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src", "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use("/", csvRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
