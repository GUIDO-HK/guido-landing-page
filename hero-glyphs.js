const field = document.querySelector(".hero-field");
const hero = field.closest(".hero");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

if (context) {
  field.append(canvas);

  const columnSpacing = 11;
  const rowSpacing = 15;
  const letters = "GUIDO";
  const symbols = ["·", ":", "+", "×"];

  let width = 0;
  let height = 0;
  let inView = false;
  let animationFrame = 0;
  let lastDraw = -Infinity;

  function resize() {
    width = field.clientWidth;
    height = field.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.font = "600 10px monospace";
    context.textBaseline = "middle";
    context.textAlign = "center";
  }

  function draw(time) {
    const phase = time / 1000;
    const driftX = Math.sin(phase * 0.55) * 0.08;
    const driftY = Math.cos(phase * 0.42) * 0.09;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#b4c8eb";

    for (let row = 0; row * rowSpacing < height; row++) {
      const y = (row + 0.5) * rowSpacing;
      const v = y / height;

      for (let column = 0; column * columnSpacing < width; column++) {
        const x = (column + 0.5) * columnSpacing;
        const u = x / width;
        const upperField = Math.exp(-(((u - 0.91 - driftX) / 0.33) ** 2 + ((v - 0.13 - driftY) / 0.25) ** 2));
        const lowerField = Math.exp(-(((u - 0.10 + driftX) / 0.30) ** 2 + ((v - 0.92 + driftY) / 0.22) ** 2));
        const wave = 0.76 + 0.24 * Math.sin(u * 17 + v * 12 - phase * 1.5);
        const intensity = (upperField * 0.83 + lowerField * 0.49) * wave;
        if (intensity < 0.11) continue;

        const glyph = intensity > 0.58
          ? letters[(column + row * 2) % letters.length]
          : symbols[Math.min(symbols.length - 1, Math.floor(intensity * 7))];
        context.globalAlpha = Math.min(0.78, intensity * 0.9);
        context.fillText(glyph, x, y);
      }
    }
  }

  function animate(time) {
    if (time - lastDraw >= 45) {
      draw(time);
      lastDraw = time;
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function updateMotion() {
    const enabled = !reduceMotion.matches;
    field.classList.toggle("has-glyph-motion", enabled);
    if (enabled && inView && !document.hidden) {
      if (!animationFrame) {
        lastDraw = -Infinity;
        animationFrame = requestAnimationFrame(animate);
      }
    } else {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  resize();
  new ResizeObserver(resize).observe(field);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateMotion();
  }).observe(hero);
  document.addEventListener("visibilitychange", updateMotion);
  reduceMotion.addEventListener("change", updateMotion);
}
