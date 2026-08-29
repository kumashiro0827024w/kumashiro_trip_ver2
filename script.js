async function loadSpots() {
  const response = await fetch("data/spots.json");
  const spots = parseSpots(await response.text());
  setupMarkers(spots);

  const container = document.getElementById("spot-container");
  spots.forEach((spot) => {
    const card = document.createElement("article");
    card.className = "spot-card";
    card.innerHTML = `
      <img class="spot-image" src="${spot.image}" alt="${spot.name}">
      <div class="spot-content">
        <div class="spot-number">SPOT ${String(spot.id).padStart(2, "0")}</div>
        <h3 class="spot-title">${spot.name}</h3>
        <p class="spot-description">${spot.description}</p>
        <a class="map-button" href="${spot.mapUrl}" target="_blank" rel="noopener">Google Mapsで見る</a>
      </div>`;
    container.appendChild(card);
  });
}

function parseSpots(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    const fixedJsonText = jsonText.replace(
      /("description"\s*:\s*"[^"\r\n]*),(\r?\n\s*"image"\s*:)/g,
      "$1\",$2"
    );
    return JSON.parse(fixedJsonText);
  }
}

function setupMarkers(spots) {
  const spotsById = new Map(spots.map((spot) => [String(spot.id), spot]));
  document.querySelectorAll(".marker[data-spot-id]").forEach((marker) => {
    const spot = spotsById.get(marker.dataset.spotId);
    if (!spot?.mapUrl) return;
    marker.href = spot.mapUrl;
    marker.target = "_blank";
    marker.rel = "noopener";
    marker.setAttribute("aria-label", `${spot.name}をGoogle Mapsで開く`);
  });
}

loadSpots();
