const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("recordedVideo");
let theme = "dark";
let mediaRecorder;
let recordedChunks = [];
let stream;

function drawClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set styles based on theme
  if (theme === "dark") {
    ctx.fillStyle = "black";
    ctx.fillRect(-10, -10, canvas.width + 10, canvas.height + 10);
    ctx.fillStyle = "white";
    document.body.style.backgroundColor = "black";
    canvas.style.backgroundColor = "black";
    video.style.backgroundColor = "black"; // Đảm bảo màu nền video đồng bộ với màu nền của canvas
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(-10, -10, canvas.width + 10, canvas.height + 10);
    ctx.fillStyle = "black";
    document.body.style.backgroundColor = "white";
    canvas.style.backgroundColor = "white";
    video.style.backgroundColor = "white"; // Đảm bảo màu nền video đồng bộ với màu nền của canvas
  }

  ctx.font = "bold 150px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw time
  const timeString = `${hours}:${minutes}:${seconds}`;
  ctx.fillText(timeString, canvas.width / 2, canvas.height / 2);
}

// Update clock every second
setInterval(drawClock, 1000);

// Initial draw
drawClock();

// Capture stream from canvas and start recording
function startRecording() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  stream = canvas.captureStream(24); // Capture at 24fps
  video.srcObject = stream;
  video.play();
}

// Start recording immediately when the page loads
window.onload = () => {
  startRecording();
};

// Switch themes on double-click
document.addEventListener("dblclick", () => {
  theme = theme === "dark" ? "light" : "dark";
  drawClock(); // Redraw clock with the new theme
  startRecording(); // Restart recording to sync with the new theme
});
