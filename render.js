const { ipcRenderer } = require("electron");
const fs = require("fs");
const $ = require("jquery");
const process = require("child_process");
const randomString = require("randomstring");

const btn = document.getElementById("upload-file");
let format = "mp3";
let directory = "./media";

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}

btn.addEventListener("click", (e) => {
  ipcRenderer.send("open-file-dialog");
});

$("#format").change(function () {
  format = $("#format option:selected").text();
});

ipcRenderer.on("selected-file", (e, paths) => {
  const randomId = randomString;
  $("#information").append(`
      <br/>
      <div class="alert alert-success" id="${randomId}">
      ${paths} is converting, please wait..
      </div>
      `);
  process.exec(
    `ffmpeg -i "${paths}" media/${randomString}_video.${format}`,
    function (error, stdout, stderr) {
      $(`#${randomId}`).detach();

      Notification.requestPermission().then(function (result) {
        let notification = new Notification("Converted successfully.", {
          body: "Your file was converted.",
        });
      });

      if (error !== null) {
        console.log(error);
      }
    }
  );
});
