export function lerp (p1, p2, t) {
  return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t }
}

export function dca (points, t) {
  let len = points.length

  if (len === 2) {
    return lerp(points[0], points[1], t)
  }

  let i = 0,
    next = []
  for (; i < len - 1; i++) {
    next.push(lerp(points[i], points[i + 1], t))
  }

  return dca(next, t)
}

export function slope (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  let ax = p1x * 3 - c1x * 9 + 9 * c2x - 3 * p2x
  let bx = c1x * 6 - 12 * c2x + 6 * p2x
  let cx = 3 * c2x - 3 * p2x

  let ay = p1y * 3 - c1y * 9 + 9 * c2y - 3 * p2y
  let by = c1y * 6 - 12 * c2y + 6 * p2y
  let cy = 3 * c2y - 3 * p2y

  let sqt = t * t

  return Math.atan((ay * sqt + by * t + cy) / (ax * sqt + bx * t + cx))
}

function getValue (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  return dca([{ x: p1x, y: p1y }, { x: c1x, y: c1y }, { x: c2x, y: c2y }, { x: p2x, y: p2y }], t)
}

// steps 根据起点和终点自动计算？
export function getLength (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, steps) {
  let step = 1 / steps
  let points = []

  let len = 0
  for (let t = 0; t < 1.0 + step; t += step) {
    points.push(getValue(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, Math.min(t, 1)))
  }
  let p0, p1, dx, dy
  for (let i = 0; i < points.length - 1; i++) {
    p0 = points[i]
    p1 = points[i + 1]
    dx = p1.x - p0.x
    dy = p1.y - p0.y
    len += Math.sqrt(dx * dx + dy * dy)
  }

  return len
}

export function getPosition (length, shape) {
  let current = 0
  const total = shape.pathLen
  let index = 0
  let t = 0

  if (length > total) {
    length = length - total
  }
  for (let i = 0, len = shape.length; i < len; i++) {
    let c = shape[i]
    current += c.bzLen
    if (current > length) {
      index = i
      t = 1 - (current - length) / c.bzLen
      break
    }
  }

  return {
    t,
    index
  }
}

export function getPoint (t, index, shape) {
  const ps = shape[index]
  return getValue(ps[0], ps[1], ps[2], ps[3], ps[4], ps[5], ps[6], ps[7], t)
}
