const apiKey = "6fd63daa98444bb09e5125035252206";

const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const weatherCard = document.getElementById("weatherContainer");

function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

function showError(message) {
  errorBox.innerText = message;
  weatherCard.classList.add("hidden");
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    showError("⚠️ Please enter a city name.");
    return;
  }

  showLoader(true);
  errorBox.innerText = "";

  fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`)
    .then(res => {
      if (!res.ok) throw new Error("❌ City not found.");
      return res.json();
    })
    .then(data => {
      showLoader(false);
      displayWeather(data);
    })
    .catch(err => {
      showLoader(false);
      showError(err.message);
    });
}

function displayWeather(data) {
  weatherCard.classList.remove("hidden");
  document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
  document.getElementById("icon").src = `https:${data.current.condition.icon}`;
  document.getElementById("condition").innerText = data.current.condition.text;
  document.getElementById("temp").innerText = data.current.temp_c;
  document.getElementById("humidity").innerText = data.current.humidity;
  document.getElementById("wind").innerText = data.current.wind_kph;

  const pm = data.current.air_quality.pm2_5;
  const aqiText = getAQIText(pm);
  const aqiEl = document.getElementById("aqi");

  aqiEl.innerText = aqiText.label;
  aqiEl.title = `PM2.5 Level: ${pm.toFixed(1)} µg/m³`;
  aqiEl.className = aqiText.class;
}

function getAQIText(pm) {
  if (pm <= 12) return { label: "Good", class: "good" };
  if (pm <= 35.4) return { label: "Moderate", class: "moderate" };
  if (pm <= 55.4) return { label: "Unhealthy", class: "unhealthy" };
  return { label: "Hazardous", class: "hazardous" };
}