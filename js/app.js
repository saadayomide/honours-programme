let lastFocusedElement = null;
let mapInstance = null;

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -28]
});

const salamancaData = {
  coreMessage:
    "Salamanca will become Madrid’s first neighborhood designed for people — cleaner streets, safer spaces for families, and stronger local businesses.",
  mapCenter: [40.42972, -3.67975],
  mapZoom: 15,
  locations: [
    {
      id: "jorge-juan-street",
      name: "Calle de Jorge Juan – Green Street & Market",
      lat: 40.423361,
      lng: -3.6769042,
      summary:
        "A calmer Jorge Juan with wider sidewalks, trees and a monthly neighborhood market.",
      changes: [
        "Parking on one side only to free space for trees and pedestrians.",
        "Street designed to host the Monthly Salamanca Market once a month.",
        "Traffic calming to prioritize residents and local visitors."
      ],
      benefits: [
        "Quieter, greener environment for residents.",
        "More customers for local shops and cafés.",
        "A new social meeting point for the neighborhood."
      ],
      images: ["calledejorjejuan.png", "calledejorgejuanmercado.png"]
    },
    {
      id: "hermosilla-street",
      name: "Calle de Hermosilla – Safe Family Street",
      lat: 40.426361,
      lng: -3.684617,
      summary:
        "A residential street redesigned with one-side parking, trees and safe crossings.",
      changes: [
        "Protected bike lane and wider sidewalks for everyday trips.",
        "New trees and benches to create shaded walking routes.",
        "Traffic calming and safer crossings for children and elderly residents."
      ],
      benefits: [
        "Safer daily routes to school and local shops.",
        "More active mobility and less noise.",
        "More pleasant public space right outside residents’ doors."
      ],
      images: ["calledehermosilla.png"]
    },
    {
      id: "velazquez-street",
      name: "Calle de Velázquez – Smart Mobility Corridor",
      lat: 40.4268995,
      lng: -3.6839794,
      summary:
        "A key north–south corridor with organized traffic and priority for public transport and bikes.",
      changes: [
        "Resident priority access on side streets, with through-traffic kept to main axes.",
        "Improved cycling connections along the corridor.",
        "Smart traffic management on intersections to reduce congestion."
      ],
      benefits: [
        "More predictable, less chaotic traffic.",
        "Faster and more reliable public transport.",
        "Cleaner air along one of the district’s main avenues."
      ],
      images: ["calledevelazquez.png"]
    }
  ]
};

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  mapInstance = L.map(mapElement).setView(
    salamancaData.mapCenter,
    salamancaData.mapZoom
  );

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  ).addTo(mapInstance);

  const bounds = [];

  salamancaData.locations.forEach((location) => {
    const marker = L.marker([location.lat, location.lng], { icon: markerIcon }).addTo(mapInstance);
    bounds.push([location.lat, location.lng]);
    marker.on("click", () => {
      if (mapInstance) {
        mapInstance.panTo([location.lat, location.lng], { animate: true, duration: 0.4 });
      }
      openLocationModal(location);
    });
  });

  if (bounds.length && mapInstance) {
    mapInstance.fitBounds(bounds, { padding: [80, 80] });
  }
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

function openLocationModal(location) {
  const modal = document.getElementById("location-modal");
  const titleEl = document.getElementById("location-modal-title");
  const summaryEl = document.getElementById("location-modal-summary");
  const changesEl = document.getElementById("location-modal-changes");
  const benefitsEl = document.getElementById("location-modal-benefits");
  const imagesEl = document.getElementById("location-modal-images");

  if (
    !modal ||
    !titleEl ||
    !summaryEl ||
    !changesEl ||
    !benefitsEl ||
    !imagesEl
  ) {
    return;
  }

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  titleEl.textContent = location.name;
  summaryEl.textContent = location.summary;

  changesEl.innerHTML = "";
  location.changes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    changesEl.appendChild(li);
  });

  benefitsEl.innerHTML = "";
  location.benefits.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    benefitsEl.appendChild(li);
  });

  imagesEl.innerHTML = "";
  location.images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = location.name;
    imagesEl.appendChild(img);
  });

  modal.hidden = false;
  const dialog = modal.querySelector(".modal__dialog");
  if (dialog) {
    dialog.setAttribute("tabindex", "-1");
    dialog.focus();
  }
}

function closeLocationModal() {
  const modal = document.getElementById("location-modal");
  if (!modal) return;
  modal.hidden = true;
  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
}

function bindModalEvents() {
  const modal = document.getElementById("location-modal");
  if (!modal) return;

  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.modalClose !== undefined) {
      closeLocationModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLocationModal();
      return;
    }

    if (modal.hidden) return;
    if (event.key !== "Tab") return;

    const dialog = modal.querySelector(".modal__dialog");
    if (!dialog) return;

    const focusable = getFocusableElements(dialog);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;
    const goingBack = event.shiftKey;

    if (!goingBack && current === last) {
      event.preventDefault();
      first.focus();
    } else if (goingBack && current === first) {
      event.preventDefault();
      last.focus();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  bindModalEvents();
});

