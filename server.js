import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // <--- IMPORT CORS HERE

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
    // It's good practice to exit the process if DB connection fails at startup
    process.exit(1);
  }
};

// --- CORS Configuration ---
// Make sure this is BEFORE any of your routes
app.use(cors({
  origin: "http://localhost:5173", // Your frontend's URL
  credentials: true, // Allow cookies/authorization headers to be sent
}));
// --- END CORS Configuration ---

app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
// You have /api/users twice, usually one is enough unless there's a reason
// app.use("/api/users", userRoute); // <-- This one might be redundant
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);


// Error handling middleware (keep this at the end, after all routes)
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  // Log the error for debugging purposes (optional)
  console.error(`Error: ${errorStatus} - ${errorMessage}`, err);

  return res.status(errorStatus).send(errorMessage);
});

app.listen(8800, () => {
  connect();
  console.log("Backend server is running on port 8800!"); // Be specific with port
});