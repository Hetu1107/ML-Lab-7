import "./input.scss";
import * as tf from "@tensorflow/tfjs";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import axios, { formToJSON } from "axios";
import { useEffect, useState } from "react";

function App() {
  const [review, setReview] = useState("");
  const [inputFileData, setInputFileData] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";

  const prediction = async (input_data) => {
    let s = "";
    let a = [];
    const model = await tf.loadLayersModel("http://localhost:5000/");
    let d = await axios
      .post("http://localhost:5000/chodu", {
        review: input_data,
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
    const predicted_value = model.predict(tf.tensor2d([a])).arraySync()[0][0];
    return predicted_value;
  };

  const load = async () => {
    const predicted_value = await prediction(review);
    // console.log(prediction);
    let ele1 = document.getElementById("one");
    let ele2 = document.getElementById("two");
    if (predicted_value > 0.5) {
      ele1.style.opacity = 1;
      ele2.style.opacity = 0.1;
    } else {
      ele2.style.opacity = 1;
      ele1.style.opacity = 0.1;
    }
    document.getElementById("load").style.zIndex = -1000;
    document.getElementById("load").style.opacity = 0;
  };

  const exportToExcel = (excelData) => {
    console.log(excelData);
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "output" + fileExtension);
  };
  const handleFileData = () => {
    document.getElementById("load").style.zIndex = 1000;
    document.getElementById("load").style.opacity = 1;
    let reader = new FileReader();
    reader.onload = async (e) => {
      const file = e.target.result;
      const lines = file.split(/\r\n|\n/);
      let output_file_data = [];
      let output_json_data = [];
      new Promise((resolve, reject) => {
        lines.forEach(async (e) => {
          let predicted_value = await prediction(e);
          if (predicted_value > 0.5) {
            output_file_data.push("Good review");
          } else {
            output_file_data.push("Bad reviw");
          }
          if (output_file_data.length == lines.length) {
            resolve("ended");
          }
        });
      })
        .then(() => {
          console.log(output_file_data);
          output_file_data.forEach((e, index) => {
            let data = {
              index: index + 1,
              Review: lines[index],
              Prediction: e,
            };
            output_json_data.push(data);
          });
        })
        .then(() => {
          exportToExcel(output_json_data);
          document.getElementById("load").style.zIndex = -1000;
          document.getElementById("load").style.opacity = 0;
        });
    };
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(selectedFile);
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
      <div className="file_input">
        <h1>Input File - (Assignment 8)</h1>
        <div>
          <input
            type="file"
            onChange={(e) => {
              const files = e.target.files[0];
              setSelectedFile(files);
            }}
          />
          <button onClick={handleFileData}>submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
