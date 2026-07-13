const verifyToken = require("./middleware/auth");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const userRoutes = require("./routes/userRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recipeRoutes = require("./routes/recipeRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recipes", recipeRoutes);

app.get("/api/test", verifyToken, (req, res) => {

    res.json({
        message: "토큰 인증 성공!",
        user: req.user
    });

});

app.get("/", (req, res) => {
    res.send("🚀 NaengTeol Server Running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});