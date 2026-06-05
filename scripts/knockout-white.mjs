import sharp from "sharp"

// Remove white background + white halo/fringe from a PNG while keeping the art.
// near-white -> fully transparent, light-grey -> ramped alpha (kills the fringe).
async function knockout(input, output, { hi = 244, lo = 218 } = {}) {
  const img = sharp(input).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    if (a === 0) continue
    const m = Math.min(r, g, b) // whiteness
    const sat = Math.max(r, g, b) - m // saturation (colored pixels stay)
    if (sat < 14) {
      if (m >= hi) {
        data[i + 3] = 0
      } else if (m >= lo) {
        const t = (m - lo) / (hi - lo) // 0..1
        data[i + 3] = Math.round(a * (1 - t))
      }
    }
  }
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(output)
  console.log("wrote", output, width + "x" + height)
}

const pub = "public/collage"
// controller is pure black -> aggressively strip the grey studio shadow too
await knockout(`${pub}/controller.png`, `${pub}/controller-cut.png`, { hi: 210, lo: 90 })
await knockout(`${pub}/hero-hand-cut.png`, `${pub}/hero-hand-clean.png`, { hi: 240, lo: 205 })
// sprout — gentle threshold so the dark soil is completely preserved
await knockout(`${pub}/sprout.png`, `${pub}/sprout-cut.png`, { hi: 248, lo: 220 })
