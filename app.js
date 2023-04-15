const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Types } = require("mongoose");
const Chat = require("./models/chat");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["https://websocket-fe.vercel.app","https://chat-ban-hang.vercel.app", "http://localhost:3000", "http://localhost:3001","http://192.168.31.38:3000"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(cookieParser());

// -----DECLARE ENV VARIABLE-----
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----USE ROUTES-----
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const notificationRoutes = require("./routes/notification");
const orderRoutes = require("./routes/order");

//-----SOCKET------
const { postCreateOrder, postStartProduceOrder, postEndProduceOrder, postStartShipOrder, postEndShipOrder } = require("./controllers/order");


app.use(authRoutes);
app.use(userRoutes);
app.use(chatRoutes);
app.use(notificationRoutes);
app.use(orderRoutes);


// -----MONGODB CONNECT-----
mongoose
  .connect(MONGO_URI)
  .then(() => {
    const server = app.listen(process.env.PORT);
    const io = require("./socket").init(server);
    io.on("connection", async (socket) => {
      socket.on('post-create-order', (data) => {
        postCreateOrder(data);
      });
      socket.on('post-start-produce-order', (data) => {
        postStartProduceOrder(data);
      });
      socket.on('post-end-produce-order', (data) => {
        postEndProduceOrder(data);
      });
      socket.on('post-start-ship-order', (data) => {
        postStartShipOrder(data);
      });
      socket.on('post-end-ship-order', (data) => {
        postEndShipOrder(data);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
