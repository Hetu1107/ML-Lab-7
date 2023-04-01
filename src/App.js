import "./input.scss";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [review, setReview] = useState("");
  const submit = () => {};
  const load = async () => {
    let s = "";
    let a = [];
    const model = await tf.loadLayersModel("http://localhost:5000/");
    let d = await axios
      .post("http://localhost:5000/chodu", {
        review: review,
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
    // console.log(prediction);
    let ele1 = document.getElementById("one");
    let ele2 = document.getElementById("two");
    if (prediction > 0.5) {
      ele1.style.opacity = 1;
      ele2.style.opacity = 0.1;
    } else {
      ele2.style.opacity = 1;
      ele1.style.opacity = 0.1;
    }
    document.getElementById("load").style.zIndex = -1000;
    document.getElementById("load").style.opacity = 0;
  };
  // useEffect(() => {
  //   load();
  // }, []);
  return (
    <div className="App">
      <div id="load">
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
        <h1>Loading...</h1>
      </div>
      <div className="box">
        <h1>Reviews Classification</h1>
        <div class="webflow-style-input bb">
          <input
            class=""
            type="text"
            placeholder="Enter the review..."
            onChange={(e) => {
              setReview(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                document.getElementById("load").style.zIndex = 1000;
                document.getElementById("load").style.opacity = 1;
                load();
              }
            }}
          ></input>
          <button
            onClick={() => {
              document.getElementById("load").style.zIndex = 1000;
              document.getElementById("load").style.opacity = 1;
              load();
            }}
          >
            🔍
          </button>
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
