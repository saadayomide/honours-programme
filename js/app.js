const locations = [
  {
    id: "jorge-juan",
    name: "Calle de Jorge Juan",
    subtitle: "Green Street & Sunday Market",
    lat: 40.4233,
    lng: -3.6769,
    summary:
      "A calmer Jorge Juan with wider sidewalks, continuous tree cover and a monthly neighborhood market that brings life to the street.",
    changes: [
      "One parking row removed — replaced with trees, planters and shaded benches.",
      "Street designed to host the Monthly Salamanca Market on Sundays.",
      "Traffic calming measures prioritize residents and pedestrians."
    ],
    benefits: [
      "Quieter, greener environment for residents.",
      "More foot traffic and customers for local shops and cafés.",
      "A new social gathering point for the neighborhood."
    ],
    images: ["calledejorjejuan.png", "calledejorgejuanmercado.png"]
  },
  {
    id: "hermosilla",
    name: "Calle de Hermosilla",
    subtitle: "Safe Family Street",
    lat: 40.4264,
    lng: -3.6780,
    summary:
      "A residential street redesigned with one-side parking, a protected bike lane, trees and safe pedestrian crossings.",
    changes: [
      "Protected bike lane and wider sidewalks for everyday trips.",
      "New trees and benches creating shaded walking routes.",
      "Redesigned crossings for children and elderly residents."
    ],
    benefits: [
      "Safer daily routes to school and local shops.",
      "More active mobility and significantly less noise.",
      "Pleasant public space right outside residents' doors."
    ],
    images: ["calledehermosilla.png"]
  },
  {
    id: "velazquez",
    name: "Calle de Velázquez",
    subtitle: "Smart Mobility Corridor",
    lat: 40.4290,
    lng: -3.6840,
    summary:
      "A key north–south corridor reorganized with resident-priority access, improved cycling connections and smart traffic signals.",
    changes: [
      "One vehicle lane converted into a multi-use corridor with greenery and cycling.",
      "Resident priority access on side streets — through-traffic redirected.",
      "AI-assisted traffic management at key intersections."
    ],
    benefits: [
      "More predictable, less chaotic traffic flow.",
      "Faster and more reliable public transport.",
      "Cleaner air along one of the district's main avenues."
    ],
    images: ["calledevelazquez.png"]
  }
];

let map = null;
let activeMarker = null;

function initMap() {
  const el = document.getElementById("map");
  if (!el) return;

  map = L.map(el, { zoomControl: false, scrollWheelZoom: true })
    .setView([40.4260, -3.6800], 15);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  ).addTo(map);

  const markers = [];

  locations.forEach((loc) => {
    const icon = L.divIcon({
      className: "",
      html:
        '<div class="marker-dot"></div>' +
        '<div class="marker-tooltip">' + loc.name + "</div>",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: icon }).addTo(map);
    markers.push({ marker, loc });

    marker.on("click", () => {
      if (activeMarker) {
        const prevDot = activeMarker.getElement().querySelector(".marker-dot");
        if (prevDot) prevDot.classList.remove("active");
      }
      activeMarker = marker;
      const dot = marker.getElement().querySelector(".marker-dot");
      if (dot) dot.classList.add("active");

      map.flyTo([loc.lat, loc.lng], 16, { duration: 0.5 });
      openPanel(loc);
    });
  });

  map.on("click", (e) => {
    if (e.originalEvent && e.originalEvent.target.closest(".marker-dot")) return;
    closePanel();
  });
}

function openPanel(loc) {
  document.getElementById("panel-title").textContent = loc.name;
  document.getElementById("panel-subtitle").textContent = loc.subtitle;
  document.getElementById("panel-summary").textContent = loc.summary;

  const changesEl = document.getElementById("panel-changes");
  changesEl.innerHTML = "";
  loc.changes.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    changesEl.appendChild(li);
  });

  const benefitsEl = document.getElementById("panel-benefits");
  benefitsEl.innerHTML = "";
  loc.benefits.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    benefitsEl.appendChild(li);
  });

  const imagesEl = document.getElementById("panel-images");
  imagesEl.innerHTML = "";
  loc.images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = loc.name + " — reimagined";
    img.loading = "lazy";
    imagesEl.appendChild(img);
  });

  document.getElementById("panel").classList.add("open");
}

function closePanel() {
  document.getElementById("panel").classList.remove("open");
  if (activeMarker) {
    const dot = activeMarker.getElement().querySelector(".marker-dot");
    if (dot) dot.classList.remove("active");
    activeMarker = null;
  }
}

function initNavHighlight() {
  const links = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll("#home, #program, #map-section");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const match = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("active", match);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initNavHighlight();
  document.getElementById("panel-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });
});
