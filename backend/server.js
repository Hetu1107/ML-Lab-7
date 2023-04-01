const express = require("express");
const fs = require("fs");
const { spawn } = require("child_process");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
// middleware to parse json
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  fs.readFile("./model.json", (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  });
});

app.post("/chodu", (req, res) => {
  var dataToSend;
  const string = req.body.review;
  const python = spawn("python", ["script1.py",string]);
  python.stdout.on("data", function (data) {
    dataToSend = data;
  });
  python.on("close", (code) => {
    res.send(dataToSend);
  });
});

app.get("/group1-shard1of1.bin", (req, res) => {
  res.sendFile(__dirname + "/group1-shard1of1.bin");
});

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
