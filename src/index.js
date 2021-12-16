require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

if (!(mongoose.connection.readState >= 1)) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/v1", require("./v1/Routes"));

const PORT = process.env.PORT || 3333;
return server.listen(PORT, () => {
  console.log(
    `⚡️ [server]: Server is running at http://localhost:${PORT} ⚡️`
  );
});