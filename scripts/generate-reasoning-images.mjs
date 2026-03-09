/**
 * Generate SVG images for all reasoning tests
 * Run: node scripts/generate-reasoning-images.mjs
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function mkDir(dir) { fs.mkdirSync(dir, { recursive: true }); return dir }

const colors = {
  red: '#EF4444', blue: '#3B82F6', green: '#10B981', yellow: '#F59E0B',
  purple: '#8B5CF6', orange: '#F97316', cyan: '#06B6D4', pink: '#EC4899',
  white: '#F1F5F9', black: '#1E293B', gray: '#94A3B8',
}

// ─── HELPER: SVG wrapper ───
function svg(w, h, content, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="#1a2332" rx="12"/>
${content}
<text x="${w/2}" y="${h-6}" text-anchor="middle" font-family="system-ui" font-size="9" fill="#475569">${label}</text>
</svg>`
}

// ─── SHAPES ───
function circle(cx, cy, r, fill, stroke) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="2"/>`
}
function rect(x, y, w, h, fill, stroke) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="2" rx="2"/>`
}
function tri(cx, cy, r, fill, stroke) {
  return `<polygon points="${cx},${cy-r} ${cx-r*0.87},${cy+r*0.5} ${cx+r*0.87},${cy+r*0.5}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="2"/>`
}
function diamond(cx, cy, r, fill, stroke) {
  return `<polygon points="${cx},${cy-r} ${cx+r*0.7},${cy} ${cx},${cy+r} ${cx-r*0.7},${cy}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="2"/>`
}
function star5(cx, cy, r, fill) {
  let pts = ''
  for (let i = 0; i < 5; i++) {
    const oa = (i * 72 - 90) * Math.PI / 180
    const ia = ((i * 72 + 36) - 90) * Math.PI / 180
    pts += `${cx + Math.cos(oa)*r},${cy + Math.sin(oa)*r} `
    pts += `${cx + Math.cos(ia)*r*0.4},${cy + Math.sin(ia)*r*0.4} `
  }
  return `<polygon points="${pts.trim()}" fill="${fill}"/>`
}

function drawShape(type, cx, cy, r, fill, stroke) {
  switch (type) {
    case 'circle': return circle(cx, cy, r, fill, stroke)
    case 'square': return rect(cx-r, cy-r, r*2, r*2, fill, stroke)
    case 'triangle': return tri(cx, cy, r, fill, stroke)
    case 'diamond': return diamond(cx, cy, r, fill, stroke)
    case 'star': return star5(cx, cy, r, fill)
    case 'hexagon': {
      let pts = ''
      for (let i = 0; i < 6; i++) { const a = (i*60-30)*Math.PI/180; pts += `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)} ` }
      return `<polygon points="${pts}" fill="${fill || 'none'}" stroke="${stroke || 'none'}" stroke-width="2"/>`
    }
    case 'cross': return `<path d="M${cx-r*0.3} ${cy-r} L${cx+r*0.3} ${cy-r} L${cx+r*0.3} ${cy-r*0.3} L${cx+r} ${cy-r*0.3} L${cx+r} ${cy+r*0.3} L${cx+r*0.3} ${cy+r*0.3} L${cx+r*0.3} ${cy+r} L${cx-r*0.3} ${cy+r} L${cx-r*0.3} ${cy+r*0.3} L${cx-r} ${cy+r*0.3} L${cx-r} ${cy-r*0.3} L${cx-r*0.3} ${cy-r*0.3} Z" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="1.5"/>`
    default: return circle(cx, cy, r, fill, stroke)
  }
}

// ─── 1. PROGRESSIVE MATRICES (Raven, MIG, WMT-2, TIG-NV, BETA-3, G-36, R-1) ───
function generateMatrix(qNum, testName) {
  const w = 280, h = 250
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star', 'cross']
  const fills = [colors.blue, colors.red, colors.green, colors.yellow, colors.purple, colors.orange, colors.cyan]

  // Use question number as seed for deterministic variation
  const seed = qNum * 7 + testName.length
  const pick = (arr, offset = 0) => arr[(seed + offset) % arr.length]

  // Determine grid size based on difficulty
  const is3x3 = qNum > 10
  const gridSize = is3x3 ? 3 : 2
  const cellSize = is3x3 ? 65 : 90
  const startX = (w - cellSize * gridSize) / 2
  const startY = 15

  let content = ''

  // Draw grid cells
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cx = startX + c * cellSize + cellSize / 2
      const cy = startY + r * cellSize + cellSize / 2
      const isLast = r === gridSize - 1 && c === gridSize - 1

      // Cell background
      content += rect(startX + c * cellSize + 2, startY + r * cellSize + 2, cellSize - 4, cellSize - 4, isLast ? '#243044' : '#1e2d3d', '#374151')

      if (isLast) {
        // Question mark
        content += `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="system-ui" font-size="28" font-weight="700" fill="${colors.blue}">?</text>`
      } else {
        // Pattern: shape + size + color progression
        const shapeIdx = (seed + r + c) % shapes.length
        const colorIdx = (seed + r * 2 + c) % fills.length
        const sizeMultiplier = 0.7 + (c * 0.15) + (r * 0.1)
        const baseSize = (cellSize * 0.3) * sizeMultiplier

        const shape = shapes[shapeIdx]
        const fill = fills[colorIdx]

        content += drawShape(shape, cx, cy, Math.min(baseSize, cellSize * 0.38), fill, '#475569')

        // Add inner element for complexity on harder questions
        if (qNum > 5) {
          const innerShape = shapes[(shapeIdx + 2) % shapes.length]
          const innerColor = fills[(colorIdx + 3) % fills.length]
          content += drawShape(innerShape, cx, cy, baseSize * 0.4, innerColor)
        }

        // Add line/stripe pattern for very hard questions
        if (qNum > 15) {
          const stripeAngle = (c * 45 + r * 30) % 180
          const a = stripeAngle * Math.PI / 180
          content += `<line x1="${cx - Math.cos(a)*baseSize}" y1="${cy - Math.sin(a)*baseSize}" x2="${cx + Math.cos(a)*baseSize}" y2="${cy + Math.sin(a)*baseSize}" stroke="${colors.gray}" stroke-width="1.5" opacity="0.4"/>`
        }
      }
    }
  }

  // Grid border
  content += rect(startX, startY, cellSize * gridSize, cellSize * gridSize, 'none', '#475569')

  return svg(w, h, content, `${testName} - Q${qNum}`)
}

// ─── 2. CLOCK SEQUENCES ───
function generateClock(qNum) {
  const w = 300, h = 200
  // Show 3 clocks in sequence + question clock
  const clockR = 32
  let content = ''

  // Generate time sequences based on question number
  const sequences = [
    [1,0, 2,0, 3,0],    // +1 hour
    [12,0, 12,15, 12,30], // +15 min
    [3,0, 6,0, 9,0],    // +3 hours
    [1,30, 3,0, 4,30],   // +1.5 hours
    [12,0, 12,5, 12,10],  // +5 min
    [2,15, 4,30, 6,45],   // +2h15
    [6,0, 5,0, 4,0],    // -1 hour
    [12,45, 12,30, 12,15], // -15 min
    [1,0, 1,10, 1,20],   // +10 min
    [3,15, 6,30, 9,45],   // +3h15
    [11,0, 8,0, 5,0],   // -3 hours
    [12,0, 6,0, 12,0],   // alternating
    [2,0, 4,0, 8,0],    // doubling
    [1,5, 2,10, 3,15],   // +1h5
    [12,0, 3,0, 6,0],   // +3 hours
  ]
  const seq = sequences[(qNum - 1) % sequences.length]

  for (let i = 0; i < 4; i++) {
    const cx = 40 + i * 68
    const cy = h / 2

    // Clock face
    content += circle(cx, cy, clockR, '#243044', '#475569')

    // Hour marks
    for (let h = 0; h < 12; h++) {
      const a = (h * 30 - 90) * Math.PI / 180
      content += `<line x1="${cx + Math.cos(a)*(clockR-6)}" y1="${cy + Math.sin(a)*(clockR-6)}" x2="${cx + Math.cos(a)*(clockR-2)}" y2="${cy + Math.sin(a)*(clockR-2)}" stroke="#64748B" stroke-width="${h%3===0?2:1}" stroke-linecap="round"/>`
    }

    if (i < 3) {
      const hour = seq[i * 2]
      const min = seq[i * 2 + 1]

      // Hour hand
      const hAngle = ((hour % 12) * 30 + min * 0.5 - 90) * Math.PI / 180
      content += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(hAngle)*clockR*0.5}" y2="${cy + Math.sin(hAngle)*clockR*0.5}" stroke="#F1F5F9" stroke-width="2.5" stroke-linecap="round"/>`

      // Minute hand
      const mAngle = (min * 6 - 90) * Math.PI / 180
      content += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(mAngle)*clockR*0.7}" y2="${cy + Math.sin(mAngle)*clockR*0.7}" stroke="${colors.blue}" stroke-width="1.5" stroke-linecap="round"/>`

      // Center dot
      content += circle(cx, cy, 2.5, colors.white)

      // Time label
      content += `<text x="${cx}" y="${cy + clockR + 16}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#94A3B8">${hour}:${String(min).padStart(2,'0')}</text>`
    } else {
      // Question mark clock
      content += `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="system-ui" font-size="24" font-weight="700" fill="${colors.blue}">?</text>`
    }

    // Arrow between clocks
    if (i < 3) {
      content += `<text x="${cx + 34}" y="${cy + 4}" text-anchor="middle" font-family="system-ui" font-size="14" fill="#475569">→</text>`
    }
  }

  return svg(w, h, content, `Relógios - Q${qNum}`)
}

// ─── 3. DOMINO SEQUENCES ───
function generateDomino(qNum, testName) {
  const w = 300, h = 180
  let content = ''

  // Domino sequences
  const sequences = [
    [[1,2],[1,2],[1,2]],     // identity
    [[3,5],[5,3],[3,5]],     // mirror
    [[1,1],[2,2],[3,3]],     // +1+1
    [[0,1],[1,2],[2,3]],     // +1+1
    [[6,6],[5,5],[4,4]],     // -1-1
    [[1,3],[2,4],[3,5]],     // +1+1
    [[2,6],[3,5],[4,4]],     // +1,-1
    [[1,0],[2,1],[3,2]],     // +1+1
    [[0,6],[1,5],[2,4]],     // +1,-1
    [[3,3],[4,2],[5,1]],     // +1,-1
    [[1,2],[3,4],[5,6]],     // +2+2
    [[6,1],[5,2],[4,3]],     // -1+1
    [[2,2],[4,4],[6,6]],     // x2
    [[0,3],[1,4],[2,5]],     // +1+1
    [[5,0],[4,1],[3,2]],     // -1+1
  ]
  const seq = sequences[(qNum - 1) % sequences.length]

  for (let i = 0; i < 4; i++) {
    const x = 20 + i * 72
    const y = h / 2 - 30

    // Domino tile
    const dw = 50, dh = 60
    content += rect(x, y, dw, dh, '#F1F5F9', '#475569')
    content += `<line x1="${x + 4}" y1="${y + dh/2}" x2="${x + dw - 4}" y2="${y + dh/2}" stroke="#94A3B8" stroke-width="1.5"/>`

    if (i < 3) {
      const [top, bottom] = seq[i]
      content += drawDominoDots(x + dw/2, y + dh/4, top, 10)
      content += drawDominoDots(x + dw/2, y + dh*3/4, bottom, 10)
    } else {
      content += `<text x="${x + dw/2}" y="${y + dh/2 + 5}" text-anchor="middle" font-family="system-ui" font-size="22" font-weight="700" fill="${colors.blue}">?</text>`
    }
  }

  return svg(w, h, content, `${testName} - Q${qNum}`)
}

function drawDominoDots(cx, cy, n, r) {
  let s = ''
  const dotR = 3
  const positions = {
    0: [],
    1: [[0, 0]],
    2: [[-0.5, -0.5], [0.5, 0.5]],
    3: [[-0.5, -0.5], [0, 0], [0.5, 0.5]],
    4: [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]],
    5: [[-0.5, -0.5], [0.5, -0.5], [0, 0], [-0.5, 0.5], [0.5, 0.5]],
    6: [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0], [0.5, 0], [-0.5, 0.5], [0.5, 0.5]],
  }
  const dots = positions[n] || []
  dots.forEach(([dx, dy]) => {
    s += `<circle cx="${cx + dx * r}" cy="${cy + dy * r}" r="${dotR}" fill="#1E293B"/>`
  })
  return s
}

// ─── 4. CUBE TESTS ───
function generateCube(qNum) {
  const w = 280, h = 220
  let content = ''

  const faceColors = [colors.red, colors.blue, colors.green, colors.yellow, '#F1F5F9', '#1E293B']
  const seed = qNum * 11

  // Draw isometric cube
  const cx = w / 2, cy = h / 2 - 10
  const s = 50

  // 3 visible faces of cube
  // Top face
  const topColor = faceColors[(seed) % 6]
  content += `<polygon points="${cx},${cy-s} ${cx+s*0.87},${cy-s*0.5} ${cx},${cy} ${cx-s*0.87},${cy-s*0.5}" fill="${topColor}" stroke="#475569" stroke-width="1.5"/>`

  // Left face
  const leftColor = faceColors[(seed+1) % 6]
  content += `<polygon points="${cx-s*0.87},${cy-s*0.5} ${cx},${cy} ${cx},${cy+s} ${cx-s*0.87},${cy+s*0.5}" fill="${leftColor}" stroke="#475569" stroke-width="1.5"/>`

  // Right face
  const rightColor = faceColors[(seed+2) % 6]
  content += `<polygon points="${cx},${cy} ${cx+s*0.87},${cy-s*0.5} ${cx+s*0.87},${cy+s*0.5} ${cx},${cy+s}" fill="${rightColor}" stroke="#475569" stroke-width="1.5"/>`

  // Face labels
  content += `<text x="${cx}" y="${cy - s*0.35}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="600" fill="${topColor === '#F1F5F9' || topColor === colors.yellow ? '#1E293B' : 'white'}">cima</text>`
  content += `<text x="${cx - s*0.4}" y="${cy + s*0.15}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="600" fill="${leftColor === '#F1F5F9' || leftColor === colors.yellow ? '#1E293B' : 'white'}">esq</text>`
  content += `<text x="${cx + s*0.4}" y="${cy + s*0.15}" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="600" fill="${rightColor === '#F1F5F9' || rightColor === colors.yellow ? '#1E293B' : 'white'}">dir</text>`

  // Rotation arrow
  if (qNum > 1) {
    const arrowY = cy + s + 20
    content += `<path d="M${cx-30} ${arrowY} Q${cx} ${arrowY-10} ${cx+30} ${arrowY}" stroke="${colors.blue}" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>`
    content += `<defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="${colors.blue}"/></marker></defs>`

    const rotations = ['90° frente', '90° direita', '90° esq', '180°', '90° trás']
    content += `<text x="${cx}" y="${arrowY + 15}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#94A3B8">${rotations[(qNum-1) % rotations.length]}</text>`
  }

  return svg(w, h, content, `Cubos - Q${qNum}`)
}

// ─── 5. BPR-5 RA (Abstract Reasoning) ───
function generateAbstract(qNum) {
  const w = 300, h = 220
  let content = ''

  // Row of 4 shapes with pattern + ? at end
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star']
  const seed = qNum * 13

  for (let i = 0; i < 5; i++) {
    const x = 25 + i * 56
    const y = h / 2

    content += rect(x - 22, y - 30, 44, 60, '#1e2d3d', '#374151')

    if (i < 4) {
      const shapeType = shapes[(seed + i) % shapes.length]
      const color = [colors.blue, colors.red, colors.green, colors.yellow][(seed + i) % 4]
      const size = 12 + (i % 3) * 4

      content += drawShape(shapeType, x, y - 5, size, color)

      // Secondary element
      if (qNum > 5) {
        const innerType = shapes[(seed + i + 2) % shapes.length]
        content += drawShape(innerType, x, y + 12, 6, colors.gray)
      }

      // Rotation/line element
      if (qNum > 10) {
        const angle = i * 45
        const a = angle * Math.PI / 180
        content += `<line x1="${x}" y1="${y - 20}" x2="${x + Math.cos(a)*15}" y2="${y - 20 + Math.sin(a)*15}" stroke="${colors.cyan}" stroke-width="1.5" stroke-linecap="round"/>`
      }
    } else {
      content += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-family="system-ui" font-size="24" font-weight="700" fill="${colors.blue}">?</text>`
    }
  }

  return svg(w, h, content, `BPR-5 RA - Q${qNum}`)
}

// ─── 6. BPR-5 RE (Spatial Reasoning) ───
function generateSpatial(qNum) {
  const w = 280, h = 220
  let content = ''

  // Show an unfolded cube net and ask which cube it makes
  const cx = w / 2
  const cy = h / 2 - 15
  const cs = 30 // cell size
  const seed = qNum * 17

  // Cross-shaped net (common cube net)
  const netPositions = [
    [0, -1], // top
    [-1, 0], [0, 0], [1, 0], [2, 0], // middle row
    [0, 1], // bottom
  ]

  const faceSymbols = ['●', '■', '▲', '◆', '★', '✕']
  const faceColors = [colors.red, colors.blue, colors.green, colors.yellow, colors.purple, colors.orange]

  netPositions.forEach(([dx, dy], i) => {
    const x = cx + dx * cs - cs * 0.5
    const y = cy + dy * cs - cs * 0.5
    content += rect(x, y, cs, cs, '#243044', '#475569')
    content += `<text x="${x + cs/2}" y="${y + cs/2 + 5}" text-anchor="middle" font-family="system-ui" font-size="14" fill="${faceColors[(seed + i) % 6]}">${faceSymbols[(seed + i) % 6]}</text>`
  })

  // Arrow
  content += `<text x="${cx}" y="${cy + cs * 2 + 5}" text-anchor="middle" font-family="system-ui" font-size="14" fill="#475569">↓ dobra para ↓</text>`

  // Small cube hint at bottom
  const cubeY = cy + cs * 2 + 25
  content += rect(cx - 20, cubeY, 40, 40, '#1e2d3d', '#374151')
  content += `<text x="${cx}" y="${cubeY + 25}" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="700" fill="${colors.blue}">?</text>`

  return svg(w, h, content, `BPR-5 RE - Q${qNum}`)
}

// ─── MAIN: Generate all images ───
const tests = [
  // Progressive matrices
  { id: 'a1000001-0000-0000-0000-000000000001', name: 'Raven', dir: 'raven', count: 20, gen: (q) => generateMatrix(q, 'Raven') },
  { id: 'a1000001-0000-0000-0000-000000000002', name: 'MIG', dir: 'mig', count: 15, gen: (q) => generateMatrix(q, 'MIG') },
  { id: 'a1000001-0000-0000-0000-000000000003', name: 'WMT-2', dir: 'wmt2', count: 15, gen: (q) => generateMatrix(q, 'WMT-2') },
  { id: 'a1000001-0000-0000-0000-000000000004', name: 'TIG-NV', dir: 'tignv', count: 20, gen: (q) => generateMatrix(q, 'TIG-NV') },
  { id: 'a1000001-0000-0000-0000-000000000005', name: 'BETA-3', dir: 'beta3', count: 15, gen: (q) => generateMatrix(q, 'BETA-3') },
  { id: 'a1000001-0000-0000-0000-000000000006', name: 'G-36', dir: 'g36', count: 20, gen: (q) => generateMatrix(q, 'G-36') },
  { id: 'a1000001-0000-0000-0000-000000000009', name: 'R-1', dir: 'r1', count: 15, gen: (q) => generateMatrix(q, 'R-1') },
  // Clock sequences
  { id: 'a1000001-0000-0000-0000-000000000007', name: 'Relogios', dir: 'relogios', count: 15, gen: (q) => generateClock(q) },
  // Domino sequences
  { id: 'a1000001-0000-0000-0000-000000000008', name: 'Dominos', dir: 'dominos', count: 15, gen: (q) => generateDomino(q, 'Dominós') },
  { id: 'a1000001-0000-0000-0000-000000000018', name: 'D-70', dir: 'd70', count: 15, gen: (q) => generateDomino(q, 'D-70') },
  // Abstract reasoning
  { id: 'a1000001-0000-0000-0000-000000000010', name: 'BPR-5 RA', dir: 'bpr5ra', count: 20, gen: (q) => generateAbstract(q) },
  // Spatial reasoning
  { id: 'a1000001-0000-0000-0000-000000000011', name: 'BPR-5 RE', dir: 'bpr5re', count: 15, gen: (q) => generateSpatial(q) },
  // Cube tests
  { id: 'a1000001-0000-0000-0000-000000000017', name: 'Cubos', dir: 'cubos', count: 15, gen: (q) => generateCube(q) },
]

let totalGenerated = 0
const sqlStatements = []

for (const test of tests) {
  const dir = mkDir(path.join(__dirname, '..', 'public', 'images', test.dir))
  console.log(`\n${test.name} (${test.count} questions)`)

  for (let q = 1; q <= test.count; q++) {
    const svgContent = test.gen(q)
    const filename = `${test.dir}-${String(q).padStart(2, '0')}.svg`
    fs.writeFileSync(path.join(dir, filename), svgContent)
    totalGenerated++
  }

  // Generate SQL for database update
  sqlStatements.push(
    `UPDATE questoes SET imagem_url = '/images/${test.dir}/${test.dir}-' || LPAD(numero::text, 2, '0') || '.svg' WHERE exercicio_id = '${test.id}';`
  )

  console.log(`  Generated ${test.count} SVGs in public/images/${test.dir}/`)
}

// Write SQL file for batch update
const sqlPath = path.join(__dirname, 'update-reasoning-images.sql')
fs.writeFileSync(sqlPath, sqlStatements.join('\n'))
console.log(`\nTotal: ${totalGenerated} images generated`)
console.log(`SQL: ${sqlPath}`)
