import { ShaderMount } from "./vendor/paper-shaders/shader-mount.js";
import { heatmapFragmentShader, toProcessedHeatmap } from "./vendor/paper-shaders/shaders/heatmap.js";
import { getShaderColorFromString } from "./vendor/paper-shaders/get-shader-color-from-string.js";

const target = document.querySelector(".hero-wordmark-shader");
const showcase = target.closest(".hero-art");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const restingFrame = 5100;
const colors = ["#080e1c00", "#0c214c55", "#213a97", "#4776d7", "#686dfc", "#19bdf4", "#94f6ff"];

async function loadTexture() {
  const maskUrl = new URL("./assets/wordmark-mask.svg", import.meta.url);
  const { blob } = await toProcessedHeatmap(maskUrl.href);
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function mountGlow() {
  const shader = new ShaderMount(target, heatmapFragmentShader, {
    u_image: await loadTexture(),
    u_colors: colors.map(color => getShaderColorFromString(color)),
    u_colorsCount: colors.length,
    u_colorBack: [0, 0, 0, 0],
    u_innerGlow: 0.13,
    u_outerGlow: 0,
    u_contour: 0.68,
    u_angle: 28,
    u_noise: 0,
    u_fit: 2,
    u_scale: 1,
    u_rotation: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_offsetX: 0,
    u_offsetY: 0,
    u_worldWidth: 0,
    u_worldHeight: 0,
  }, {}, 0, restingFrame);

  let animationFrame = 0;
  let nextFrame = restingFrame;

  function moveLight(event) {
    if (reduceMotion.matches || event.pointerType !== "mouse") return;
    const x = event.clientX / document.documentElement.clientWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    nextFrame = restingFrame + x * 2300 + y * 900;

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        shader.setFrame(nextFrame);
      });
    }
  }

  function resetLight() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    shader.setFrame(restingFrame);
  }

  showcase.classList.add("has-glow-shader");
  document.addEventListener("pointermove", moveLight);
  document.documentElement.addEventListener("pointerleave", resetLight);
  reduceMotion.addEventListener("change", resetLight);

  shader.canvasElement.addEventListener("webglcontextlost", () => {
    showcase.classList.remove("has-glow-shader");
    document.removeEventListener("pointermove", moveLight);
    document.documentElement.removeEventListener("pointerleave", resetLight);
    reduceMotion.removeEventListener("change", resetLight);
    cancelAnimationFrame(animationFrame);
    shader.dispose();
  }, { once: true });
}

// The SVG remains visible when WebGL or the shader assets are unavailable.
mountGlow().catch(() => target.replaceChildren());
