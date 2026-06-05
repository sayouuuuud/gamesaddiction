import sharp from "sharp"
import path from "node:path"

/**
 * Flood-fill background removal from the corners.
 * Treats light, low-saturation pixels connected to the image border as
 * background and makes them transparent, leaving the subject + its soft
 * shadow intact. Produces clean floating objects like sutera.ch.
 */
async function cutout(file, { tol = 38 } = {}) {
  const abs = path.resolve(file)
  const img = sharp(abs).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels: c } = info

  const idx = (x, y) => (y * w + x) * c
  // reference background colour = average of the four corners
  const corners = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ]
  let br = 0,
    bg = 0,
    bb = 0
  for (const [x, y] of corners) {
    const i = idx(x, y)
    br += data[i]
    bg += data[i + 1]
    bb += data[i + 2]
  }
  br /= 4
  bg /= 4
  bb /= 4

  const visited = new Uint8Array(w * h)
  const stack = []
  for (const [x, y] of corners) stack.push([x, y])

  const close = (i) => {
    const dr = data[i] - br
    const dg = data[i + 1] - bg
    const db = data[i + 2] - bb
    return Math.sqrt(dr * dr + dg * dg + db * db) < tol
  }

  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= w || y >= h) continue
    const p = y * w + x
    if (visited[p]) continue
    const i = idx(x, y)
    if (!close(i)) continue
    visited[p] = 1
    data[i + 3] = 0 // transparent
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  // feather: soften the alpha edge by 1px to avoid hard jaggies
  const out = sharp(data, { raw: { width: w, height: h, channels: c } }).png()
  await out.toFile(abs.replace(/\.png$/, "-cut.png"))
  console.log("cut ->", abs.replace(/\.png$/, "-cut.png"))
}

const files = process.argv.slice(2)
for (const f of files) await cutout(f)
