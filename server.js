const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/socialmedia")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

// Schema
const postSchema = new mongoose.Schema({
    name: String,
    text: String,
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: [String],
        default: []
    }
});

// Model
const Post = mongoose.model("Post", postSchema);

// Test Route
app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

app.listen(5000, () => {
    console.log("Server Started on Port 5000");
});