// Get DOM elements
const alertBtn = document.getElementById('alertBtn');
const locationSpan = document.getElementById('location');
const video = document.getElementById('video');
const alarmBtn = document.getElementById('alarmBtn');
const alarmSound = document.getElementById('alarmSound');

// Function to get and display location
function shareLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationSpan.textContent = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        // You can also send this data to a server or share it via SMS/WhatsApp
      },
      (error) => {
        locationSpan.textContent = 'Unable to retrieve location.';
        console.error('Location error:', error);
      }
    );
  } else {
    locationSpan.textContent = 'Geolocation not supported.';
  }
}

// Function to start video stream
function startVideoStream() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        alert('Unable to access camera. Please check permissions.');
      });
  } else {
    alert('Camera not supported on this device.');
  }
}

// Function to trigger alarm
function triggerAlarm() {
  alarmSound.play();
}

// Event listeners
alertBtn.addEventListener('click', () => {
  shareLocation();
  startVideoStream();
});

alarmBtn.addEventListener('click', triggerAlarm);