const desktop = matchMedia("(min-width: 768px)");
const rail = document.querySelector(".page-rail");
const trigger = rail.querySelector(".rail-trigger");
const panel = rail.querySelector(".rail-panel");

async function loadRouteRail() {
  if (!desktop.matches || !panel.showPopover) return;
  desktop.removeEventListener("change", loadRouteRail);
  await import("./rail.js?v=active-section");
  rail.hidden = false;
}

desktop.addEventListener("change", loadRouteRail);
loadRouteRail();

let pinned = false;
let leaveTimer;

function isOpen() {
  return panel.matches(":popover-open");
}

trigger.addEventListener("click", event => {
  event.preventDefault();
  clearTimeout(leaveTimer);
  if (pinned && isOpen()) {
    panel.hidePopover();
  } else {
    pinned = true;
    panel.showPopover();
  }
});

rail.addEventListener("pointerenter", event => {
  clearTimeout(leaveTimer);
  if (event.pointerType === "mouse" && !isOpen()) panel.showPopover();
});

rail.addEventListener("pointerleave", event => {
  if (event.pointerType !== "mouse") return;
  leaveTimer = setTimeout(() => {
    if (!pinned && !panel.contains(document.activeElement)) panel.hidePopover();
  }, 150);
});

panel.addEventListener("toggle", () => {
  if (!isOpen()) pinned = false;
});

desktop.addEventListener("change", () => {
  if (!desktop.matches && isOpen()) panel.hidePopover();
});
