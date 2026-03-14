const salamancaData = {
  mapCenter: [40.42972, -3.67975],
  mapZoom: 15,
  locations: [
    {
      id: "jorge-juan-street",
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
      id: "hermosilla-street",
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
      id: "velazquez-street",
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
  ]
};

let mapInstance = null;
let activeMarkerEl = null;

function createMarkerIcon() {
  return L.divIcon({
    className: "",
    html: '<div class="marker-dot"></div><div class="marker-label"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

function setMarkerLabel(marker, text) {
  const label = marker.getElement().querySelector(".marker-label");
  if (label) label.textContent = text;
}

function setMarkerActive(marker, active) {
  const dot = marker.getElement().querySelector(".marker-dot");
  if (!dot) return;
  if (active) {
    dot.classList.add("active");
  } else {
    dot.classList.remove("active");
  }
}

function initMap() {
  const el = document.getElementById("map");
  if (!el) return;

  mapInstance = L.map(el, {
    zoomControl: false,
    scrollWheelZoom: true
  }).setView(salamancaData.mapCenter, salamancaData.mapZoom);

  L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  ).addTo(mapInstance);

  const bounds = [];

  salamancaData.locations.forEach((loc) => {
    const marker = L.marker([loc.lat, loc.lng], { icon: createMarkerIcon() }).addTo(mapInstance);
    bounds.push([loc.lat, loc.lng]);

    marker.once("add", () => {
      setMarkerLabel(marker, loc.name);
    });

    marker.on("click", () => {
      if (activeMarkerEl) setMarkerActive(activeMarkerEl, false);
      activeMarkerEl = marker;
      setMarkerActive(marker, true);

      mapInstance.flyTo([loc.lat, loc.lng], 16, { duration: 0.6 });
      openPanel(loc);
    });
  });

  if (bounds.length) {
    mapInstance.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
  }

  mapInstance.on("click", (e) => {
    if (e.originalEvent.target.closest(".marker-dot")) return;
    closePanel();
  });
}

function openPanel(loc) {
  const panel = document.getElementById("panel");
  const title = document.getElementById("panel-title");
  const summary = document.getElementById("panel-summary");
  const changes = document.getElementById("panel-changes");
  const benefits = document.getElementById("panel-benefits");
  const images = document.getElementById("panel-images");

  title.textContent = loc.name + " — " + loc.subtitle;
  summary.textContent = loc.summary;

  changes.innerHTML = "";
  loc.changes.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    changes.appendChild(li);
  });

  benefits.innerHTML = "";
  loc.benefits.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    benefits.appendChild(li);
  });

  images.innerHTML = "";
  loc.images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = loc.name + " — reimagined";
    img.loading = "lazy";
    images.appendChild(img);
  });

  panel.classList.add("open");
}

function closePanel() {
  const panel = document.getElementById("panel");
  panel.classList.remove("open");
  if (activeMarkerEl) {
    setMarkerActive(activeMarkerEl, false);
    activeMarkerEl = null;
  }
}

function initPanelEvents() {
  document.getElementById("panel-close").addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });
}

function initScrollAnimations() {
  const targets = document.querySelectorAll(".card, .timeline, .vision-block, .prose, .hero__content, .hero__grid > aside");
  targets.forEach((el) => el.classList.add("fade-up"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}

function initNavHighlight() {
  const links = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll("#home, #program, #map-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          const href = link.getAttribute("href").replace("#", "");
          const match = href === id || (href === "map" && id === "map-section");
          link.classList.toggle("active", match);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initPanelEvents();
  initScrollAnimations();
  initNavHighlight();
});
