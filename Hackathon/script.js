// Elements
const alertBtn = document.getElementById('alertBtn');
const locationSpan = document.getElementById('location');
const mapLinkDiv = document.getElementById('mapLink');
const video = document.getElementById('video');
const alarmBtn = document.getElementById('alarmBtn');
const sosBtn = document.getElementById('sosBtn');
const alarmSound = document.getElementById('alarmSound');
const sosSound = document.getElementById('sosSound');

let sosActive = false;

// ✅ Get and display location
function shareLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationSpan.textContent = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        mapLinkDiv.innerHTML = `<a href="${mapUrl}" target="_blank">📍 View on Google Maps</a>`;
        
        // Pre-fill emergency WhatsApp/SMS message
        const message = encodeURIComponent(
          `🚨 EMERGENCY! I need help.\nMy current location: ${mapUrl}`
        );
        const whatsappLink = `https://wa.me/?text=${message}`;
        const smsLink = `sms:?body=${message}`;
        mapLinkDiv.innerHTML += `
          <div style="margin-top: 8px;">
            <a href="${whatsappLink}" target="_blank">💬 Send via WhatsApp</a> |
            <a href="${smsLink}">📱 Send via SMS</a>
          </div>`;
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

// ✅ Start video stream
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

// ✅ Trigger short alarm sound, flash, and vibration
function triggerAlarm() {
  alarmSound.currentTime = 0;
  alarmSound.play();

  document.body.classList.add('sos-active');
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);

  setTimeout(() => {
    document.body.classList.remove('sos-active');
  }, 4000);
}

// ✅ SOS Mode: continuous siren, vibration, and screen flash
function toggleSOS() {
  if (sosActive) {
    // Stop SOS
    sosSound.pause();
    sosSound.currentTime = 0;
    document.body.classList.remove('sos-active');
    sosBtn.textContent = '🚨 SOS Mode';
    sosActive = false;
    if (navigator.vibrate) navigator.vibrate(0);
  } else {
    // Start SOS
    sosSound.currentTime = 0;
    sosSound.play();
    sosSound.loop = true;
    document.body.classList.add('sos-active');
    sosBtn.textContent = '⛔ Stop SOS';
    sosActive = true;

    // Continuous vibration pattern
    if (navigator.vibrate) {
      const vibratePattern = [500, 300, 500, 300];
      navigator.vibrate(vibratePattern);
    }
  }
}

// ✅ Event listeners
alertBtn.addEventListener('click', () => {
  shareLocation();
  startVideoStream();
});

alarmBtn.addEventListener('click', triggerAlarm);
sosBtn.addEventListener('click', toggleSOS);
