import "./input.scss";
import * as tf from "@tensorflow/tfjs";
import { useEffect } from "react";

function App() {
  const submit = () => {};
  const load = async () => {
    const model = await tf.loadLayersModel("http://localhost:5000/");
    console.log(
      model
        .predict(
          tf.tensor2d([
            [
              1, 9, 253, 1, 4, 239, 53, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0,
            ],
          ])
        )
        .print()
    );
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
