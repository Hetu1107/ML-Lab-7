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

app.get("/chodu", (req, res) => {
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ["script1.py"]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend);
  });
});

app.get("/group1-shard1of1.bin", (req, res) => {
  res.sendFile(__dirname + "/group1-shard1of1.bin");
});

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
