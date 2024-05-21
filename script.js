const videoElement = document.getElementById('video');
const toggleCameraButton = document.getElementById('toggle-camera');
const predictionElement = document.getElementById('predicted-sign');
const socket = io.connect('http://localhost:5000');

let cameraOn = false;
//const frameInterval = 200; // capture every 1s

toggleCameraButton.addEventListener('click', () => {
  if (!cameraOn) {
    startCamera();
    toggleCameraButton.textContent = 'Turn off Camera';
  } else {
    stopCamera();
    toggleCameraButton.textContent = 'Turn on Camera';
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('sign', (sign) => {
  predictionElement.textContent = `Detected Sign: ${sign}`;
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    cameraOn = true;

    setInterval(() => captureFrame(),250); // set interval
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

    
function captureFrame() {
  if (!cameraOn) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL('image/jpeg');
  socket.emit('frame', dataURL);
  //setTimeout(captureFrame,frameInterval);
  //requestAnimationFrame(captureFrame);
}

function stopCamera() {
  const stream = videoElement.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach(track => track.stop());

  videoElement.srcObject = null;
  cameraOn = false;
}
