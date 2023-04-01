import "./input.scss";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const submit = () => {};
  const load = async () => {
    let s = "";
    let a = [];
    const model = await tf.loadLayersModel("http://localhost:5000/");
    let d = await axios
      .post("http://localhost:5000/chodu", {
        review: "very good product",
      })
      .then((e) => {
        let d = e.data;
        return d;
      });
    for (let i = 0; i < d.length; i++) {
      if (d[i] == "[" || d[i] == "]" || d[i] == "\\" || d[i] == "/") {
        continue;
      } else if (d[i] == " ") {
        if (s != "") {
          a.push(parseInt(s));
        }
        s = "";
      } else {
        s += d[i];
      }
    }
    a.push(parseInt(s));
    console.log(a);
    const prediction = model.predict(tf.tensor2d([a])).arraySync()[0][0];
    console.log(prediction);
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="App">
      <div className="box">
        <h1>Reviews Classification</h1>
        <div class="webflow-style-input bb">
          <input class="" type="text" placeholder="Enter the review..."></input>
          <button onClick={submit}>🔍</button>
        </div>
        <div className="emojis">
          <p id="one">😄</p>
          <p id="two">🥺</p>
        </div>
      </div>
    </div>
  );
}

export default App;
