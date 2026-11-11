const steps = [
  ["route", "route selection", "Compare routes to your destination."],
  ["navigation", "turn-by-turn navigation", "Start walking with guidance for the route you picked."],
  ["arrival", "arrival confirmation", "See when you’ve reached your destination."],
  ["feedback", "a walk feedback form", "Rate the experience to help improve future navigation."],
];

const stepButtons = document.querySelectorAll("[data-step]");
const preview = document.querySelector("#app-preview");
const caption = document.querySelector("#app-caption");
const progress = document.querySelector(".step-progress");
const progressFill = progress.firstElementChild;
const playback = document.querySelector("#step-playback");
const announcement = document.querySelector("#step-announcement");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const stepDuration = 3000;

let activeStep = 0;
let autoplay = !reducedMotion.matches;
let playerVisible = false;
let stepAnimation;

function showStep(index) {
  stepAnimation?.cancel();
  stepAnimation = undefined;
  activeStep = index;
  stepButtons[index].append(progress);
  const [screen, description, message] = steps[index];

  for (const [stepIndex, button] of stepButtons.entries()) {
    button.setAttribute("aria-pressed", String(stepIndex === index));
  }

  preview.src = `assets/app-${screen}.webp`;
  preview.alt = `GUIDO app concept showing ${description}`;
  caption.textContent = message;
}

function updatePlayback() {
  if (!autoplay || !playerVisible || document.hidden) {
    stepAnimation?.pause();
    return;
  }

  if (stepAnimation) {
    stepAnimation.play();
    return;
  }

  const animation = progressFill.animate(
    [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }],
    { duration: stepDuration, fill: "forwards" },
  );
  stepAnimation = animation;
  animation.onfinish = () => {
    if (stepAnimation !== animation) return;
    showStep((activeStep + 1) % steps.length);
    updatePlayback();
  };
}

function setAutoplay(enabled) {
  autoplay = enabled;
  playback.setAttribute("aria-label", enabled ? "Pause autoplay" : "Play steps automatically");
  playback.dataset.playing = String(enabled);
  updatePlayback();
}

for (const button of stepButtons) {
  button.addEventListener("click", () => {
    showStep(Number(button.dataset.step));
    announcement.textContent = caption.textContent;
    updatePlayback();
  });
}

playback.hidden = false;
setAutoplay(autoplay);
playback.addEventListener("click", () => setAutoplay(!autoplay));
reducedMotion.addEventListener("change", event => {
  if (event.matches) setAutoplay(false);
});
document.addEventListener("visibilitychange", updatePlayback);

const observer = new IntersectionObserver(([entry]) => {
  playerVisible = entry.intersectionRatio >= 0.25;
  updatePlayback();
}, { threshold: 0.25 });
observer.observe(document.querySelector(".journey-steps"));

for (const link of document.querySelectorAll('.site-footer a[href^="#"]')) {
  link.addEventListener("click", event => {
    if (event.defaultPrevented || reducedMotion.matches || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;

    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
