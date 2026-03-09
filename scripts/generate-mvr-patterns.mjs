/**
 * Generate SVG visual patterns for MVR (Visual Memory Recognition) test
 * Run: node scripts/generate-mvr-patterns.mjs
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, '..', 'public', 'images', 'mvr')
fs.mkdirSync(outputDir, { recursive: true })

const colors = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  orange: '#F97316',
  pink: '#EC4899',
  cyan: '#06B6D4',
}

// Each MVR question references specific visual patterns
const patterns = [
  // Q1: Sequence of 8 symbols
  { id: 1, type: 'symbol-sequence', desc: 'estrela, lua, sol, nuvem, raio, gota, flor, arvore' },
  // Q2: 6 geometric patterns
  { id: 2, type: 'geometric-pattern', desc: 'Tres circulos concentricos cortados por uma linha diagonal' },
  // Q3: 7 shapes in rectangular space
  { id: 3, type: 'spatial-arrangement', desc: 'Arranjo de 7 formas' },
  // Q4: Two similar figures (spot the difference)
  { id: 4, type: 'spot-difference', desc: 'Casa, arvore, cerca, nuvens' },
  // Q5: 15 small objects on table
  { id: 5, type: 'object-collection', desc: '15 objetos numa mesa' },
  // Q6: 5 overlapping shapes
  { id: 6, type: 'overlapping-shapes', desc: '5 formas sobrepostas' },
  // Q7: 10 cards in circle
  { id: 7, type: 'circle-cards', desc: '10 cartoes em circulo' },
  // Q8: Color sequence
  { id: 8, type: 'color-sequence', desc: 'vermelho, azul, verde, amarelo, roxo, laranja, rosa, marrom' },
  // Q9: 4x4 mosaic
  { id: 9, type: 'mosaic', desc: 'Mosaico 4x4 azul, branco, cinza' },
  // Q10: Three versions of same figure
  { id: 10, type: 'three-versions', desc: 'Original e duas versoes modificadas' },
  // Q11: Scene with 6 objects
  { id: 11, type: 'scene', desc: 'Livro, caneta, xicara, lampada, relogio, quadro' },
  // Q12: Connected lines pattern
  { id: 12, type: 'line-pattern', desc: 'Linhas interconectadas com nos' },
  // Q13: 5 symbols (shape + fill combinations)
  { id: 13, type: 'shape-fill-combo', desc: 'Forma + preenchimento' },
  // Q14: 8 arrows in two rows
  { id: 14, type: 'arrow-grid', desc: '8 setas em duas fileiras' },
  // Q15: Complex visual composition
  { id: 15, type: 'composition', desc: '3 circulos azuis, 2 quadrados vermelhos, 1 triangulo amarelo' },
]

function generatePatternSVG(p) {
  const w = 300, h = 250
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  s += `<rect width="${w}" height="${h}" fill="#1a2332" rx="12"/>`

  switch (p.type) {
    case 'symbol-sequence':
      s += drawSymbolSequence(w, h)
      break
    case 'geometric-pattern':
      s += drawGeometricPattern(w, h)
      break
    case 'spatial-arrangement':
      s += drawSpatialArrangement(w, h)
      break
    case 'spot-difference':
      s += drawSpotDifference(w, h)
      break
    case 'object-collection':
      s += drawObjectCollection(w, h)
      break
    case 'overlapping-shapes':
      s += drawOverlappingShapes(w, h)
      break
    case 'circle-cards':
      s += drawCircleCards(w, h)
      break
    case 'color-sequence':
      s += drawColorSequence(w, h)
      break
    case 'mosaic':
      s += drawMosaic(w, h)
      break
    case 'three-versions':
      s += drawThreeVersions(w, h)
      break
    case 'scene':
      s += drawScene(w, h)
      break
    case 'line-pattern':
      s += drawLinePattern(w, h)
      break
    case 'shape-fill-combo':
      s += drawShapeFillCombo(w, h)
      break
    case 'arrow-grid':
      s += drawArrowGrid(w, h)
      break
    case 'composition':
      s += drawComposition(w, h)
      break
  }

  s += `<text x="${w/2}" y="${h - 8}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#475569">Padrão ${p.id}</text>`
  s += '</svg>'
  return s
}

function drawSymbolSequence(w, h) {
  let s = ''
  const symbols = ['star', 'moon', 'sun', 'cloud', 'bolt', 'drop', 'flower', 'tree']
  const cols = ['#F59E0B', '#94A3B8', '#F59E0B', '#94A3B8', '#F59E0B', '#3B82F6', '#EC4899', '#10B981']
  const gap = w / (symbols.length + 1)
  symbols.forEach((sym, i) => {
    const x = gap * (i + 1), y = h / 2
    s += drawSymbol(sym, x, y, 20, cols[i])
  })
  return s
}

function drawSymbol(type, cx, cy, size, color) {
  let s = ''
  const r = size / 2
  switch (type) {
    case 'star':
      s += star(cx, cy, r, color)
      break
    case 'moon':
      s += `<path d="M${cx-r} ${cy} A${r} ${r} 0 1 1 ${cx+r*0.3} ${cy-r} A${r*0.7} ${r*0.7} 0 0 0 ${cx-r} ${cy}" fill="${color}"/>`
      break
    case 'sun':
      s += `<circle cx="${cx}" cy="${cy}" r="${r*0.5}" fill="${color}"/>`
      for (let i = 0; i < 8; i++) {
        const a = (i * 45) * Math.PI / 180
        s += `<line x1="${cx + Math.cos(a)*r*0.6}" y1="${cy + Math.sin(a)*r*0.6}" x2="${cx + Math.cos(a)*r}" y2="${cy + Math.sin(a)*r}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`
      }
      break
    case 'cloud':
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r*0.6}" fill="${color}"/>`
      s += `<circle cx="${cx-r*0.4}" cy="${cy-r*0.3}" r="${r*0.45}" fill="${color}"/>`
      s += `<circle cx="${cx+r*0.4}" cy="${cy-r*0.2}" r="${r*0.4}" fill="${color}"/>`
      break
    case 'bolt':
      s += `<polygon points="${cx-r*0.2},${cy-r} ${cx+r*0.5},${cy-r} ${cx},${cy} ${cx+r*0.3},${cy} ${cx-r*0.4},${cy+r} ${cx+r*0.1},${cy-r*0.1}" fill="${color}"/>`
      break
    case 'drop':
      s += `<path d="M${cx} ${cy-r} Q${cx+r} ${cy} ${cx} ${cy+r} Q${cx-r} ${cy} ${cx} ${cy-r}" fill="${color}"/>`
      break
    case 'flower':
      for (let i = 0; i < 5; i++) {
        const a = (i * 72 - 90) * Math.PI / 180
        s += `<circle cx="${cx + Math.cos(a)*r*0.5}" cy="${cy + Math.sin(a)*r*0.5}" r="${r*0.35}" fill="${color}" opacity="0.8"/>`
      }
      s += `<circle cx="${cx}" cy="${cy}" r="${r*0.25}" fill="#F59E0B"/>`
      break
    case 'tree':
      s += `<rect x="${cx-r*0.15}" y="${cy}" width="${r*0.3}" height="${r}" fill="#8B4513"/>`
      s += `<polygon points="${cx},${cy-r} ${cx-r*0.7},${cy+r*0.2} ${cx+r*0.7},${cy+r*0.2}" fill="${color}"/>`
      break
  }
  return s
}

function star(cx, cy, r, color) {
  let pts = ''
  for (let i = 0; i < 5; i++) {
    const outerA = (i * 72 - 90) * Math.PI / 180
    const innerA = ((i * 72 + 36) - 90) * Math.PI / 180
    pts += `${cx + Math.cos(outerA)*r},${cy + Math.sin(outerA)*r} `
    pts += `${cx + Math.cos(innerA)*r*0.4},${cy + Math.sin(innerA)*r*0.4} `
  }
  return `<polygon points="${pts.trim()}" fill="${color}"/>`
}

function drawGeometricPattern(w, h) {
  let s = ''
  const cx = w/2, cy = h/2
  s += `<circle cx="${cx}" cy="${cy}" r="60" fill="none" stroke="${colors.blue}" stroke-width="2"/>`
  s += `<circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="${colors.blue}" stroke-width="2"/>`
  s += `<circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="${colors.blue}" stroke-width="2"/>`
  s += `<line x1="${cx-65}" y1="${cy+65}" x2="${cx+65}" y2="${cy-65}" stroke="${colors.red}" stroke-width="2.5"/>`
  return s
}

function drawSpatialArrangement(w, h) {
  let s = ''
  const shapes = [
    { x: 220, y: 50, type: 'tri', c: colors.green },    // top right (answer)
    { x: 80, y: 60, type: 'hex', c: colors.purple },
    { x: 150, y: 90, type: 'diamond', c: colors.orange },
    { x: 60, y: 140, type: 'circle', c: colors.blue },
    { x: 200, y: 150, type: 'rect', c: colors.red },
    { x: 130, y: 180, type: 'tri', c: colors.yellow },
    { x: 240, y: 190, type: 'circle', c: colors.cyan },
  ]
  shapes.forEach(sh => {
    if (sh.type === 'tri') s += `<polygon points="${sh.x},${sh.y-15} ${sh.x-15},${sh.y+15} ${sh.x+15},${sh.y+15}" fill="${sh.c}"/>`
    else if (sh.type === 'hex') {
      let pts = ''
      for (let i = 0; i < 6; i++) { const a = (i*60-30)*Math.PI/180; pts += `${sh.x+15*Math.cos(a)},${sh.y+15*Math.sin(a)} ` }
      s += `<polygon points="${pts}" fill="${sh.c}"/>`
    }
    else if (sh.type === 'diamond') s += `<polygon points="${sh.x},${sh.y-18} ${sh.x+12},${sh.y} ${sh.x},${sh.y+18} ${sh.x-12},${sh.y}" fill="${sh.c}"/>`
    else if (sh.type === 'circle') s += `<circle cx="${sh.x}" cy="${sh.y}" r="14" fill="${sh.c}"/>`
    else if (sh.type === 'rect') s += `<rect x="${sh.x-12}" y="${sh.y-12}" width="24" height="24" fill="${sh.c}" rx="3"/>`
  })
  return s
}

function drawSpotDifference(w, h) {
  let s = ''
  // Left figure
  const lx = 75, ly = h/2
  s += drawHouse(lx - 30, ly - 40, colors.red, 2) // 2 windows
  s += drawTree(lx + 35, ly, colors.green)
  s += `<line x1="${lx-50}" y1="${ly+25}" x2="${lx+55}" y2="${ly+25}" stroke="#8B4513" stroke-width="2"/>`
  // Right figure
  const rx = 225
  s += drawHouse(rx - 30, ly - 40, colors.red, 3) // 3 windows (difference!)
  s += drawTree(rx + 35, ly, colors.green)
  s += `<line x1="${rx-50}" y1="${ly+25}" x2="${rx+55}" y2="${ly+25}" stroke="#8B4513" stroke-width="2"/>`
  // Divider
  s += `<line x1="${w/2}" y1="30" x2="${w/2}" y2="${h-30}" stroke="#475569" stroke-width="1" stroke-dasharray="4 4"/>`
  s += `<text x="75" y="30" text-anchor="middle" font-family="system-ui" font-size="11" fill="#94A3B8">Figura A</text>`
  s += `<text x="225" y="30" text-anchor="middle" font-family="system-ui" font-size="11" fill="#94A3B8">Figura B</text>`
  return s
}

function drawHouse(x, y, color, windows) {
  let s = ''
  s += `<rect x="${x}" y="${y+25}" width="50" height="40" fill="${color}" rx="2"/>`
  s += `<polygon points="${x-5},${y+25} ${x+25},${y} ${x+55},${y+25}" fill="#8B4513"/>`
  s += `<rect x="${x+20}" y="${y+45}" width="10" height="20" fill="#4A2511" rx="1"/>`
  for (let i = 0; i < windows; i++) {
    const wx = x + 8 + i * 15
    if (wx + 8 < x + 50)
      s += `<rect x="${wx}" y="${y+32}" width="8" height="8" fill="#60A5FA" rx="1"/>`
  }
  return s
}

function drawTree(x, y, color) {
  let s = ''
  s += `<rect x="${x-3}" y="${y}" width="6" height="25" fill="#8B4513"/>`
  s += `<circle cx="${x}" cy="${y-10}" r="18" fill="${color}"/>`
  return s
}

function drawObjectCollection(w, h) {
  let s = ''
  const icons = ['circle', 'rect', 'tri', 'star', 'diamond']
  const iconColors = [colors.red, colors.blue, colors.green, colors.yellow, colors.purple]
  for (let i = 0; i < 15; i++) {
    const x = 30 + (i % 5) * 55
    const y = 45 + Math.floor(i / 5) * 65
    const type = icons[i % 5]
    const c = iconColors[(i * 3) % 5]
    if (type === 'circle') s += `<circle cx="${x}" cy="${y}" r="12" fill="${c}"/>`
    else if (type === 'rect') s += `<rect x="${x-10}" y="${y-10}" width="20" height="20" fill="${c}" rx="2"/>`
    else if (type === 'tri') s += `<polygon points="${x},${y-12} ${x-12},${y+12} ${x+12},${y+12}" fill="${c}"/>`
    else if (type === 'star') s += star(x, y, 12, c)
    else if (type === 'diamond') s += `<polygon points="${x},${y-12} ${x+10},${y} ${x},${y+12} ${x-10},${y}" fill="${c}"/>`
  }
  return s
}

function drawOverlappingShapes(w, h) {
  let s = ''
  const cx = w/2, cy = h/2
  // From back to front: circle, square, triangle, diamond, star
  s += `<circle cx="${cx-20}" cy="${cy+15}" r="40" fill="${colors.blue}" opacity="0.7"/>`
  s += `<rect x="${cx-35}" y="${cy-35}" width="55" height="55" fill="${colors.red}" opacity="0.7" rx="3"/>`
  s += `<polygon points="${cx},${cy-45} ${cx-40},${cy+20} ${cx+40},${cy+20}" fill="${colors.green}" opacity="0.7"/>`
  s += `<polygon points="${cx+20},${cy-30} ${cx+50},${cy} ${cx+20},${cy+30} ${cx-10},${cy}" fill="${colors.orange}" opacity="0.7"/>`
  s += star(cx+5, cy-5, 25, colors.yellow)
  return s
}

function drawCircleCards(w, h) {
  let s = ''
  const cx = w/2, cy = h/2 - 5
  const r = 80
  const symbols = ['star', 'moon', 'drop', 'bolt', 'flower', 'sun', 'cloud', 'tree', 'star', 'moon']
  const symbolColors = [colors.yellow, colors.blue, colors.cyan, colors.orange, colors.pink, colors.yellow, colors.blue, colors.green, colors.red, colors.purple]
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * Math.PI / 180
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    s += `<rect x="${x-15}" y="${y-15}" width="30" height="30" fill="#243044" stroke="#475569" stroke-width="1" rx="4"/>`
    s += drawSymbol(symbols[i], x, y, 18, symbolColors[i])
    // Clock position label
    const lx = cx + Math.cos(a) * (r + 18)
    const ly = cy + Math.sin(a) * (r + 18)
    const hour = ((i * 36 + 360) % 360) / 30
    // only label 3, 6, 9, 12 o'clock positions
    if (i % 3 === 0 || i === 0) {
      s += `<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-family="system-ui" font-size="8" fill="#64748B">${i === 0 ? '12h' : i === 3 ? '3h' : i === 6 ? '6h' : '9h'}</text>`
    }
  }
  return s
}

function drawColorSequence(w, h) {
  let s = ''
  const seqColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316', '#EC4899', '#92400E']
  const names = ['V', 'Az', 'Vd', 'Am', 'Rx', 'Lr', 'Rs', 'Mr']
  const gap = w / (seqColors.length + 1)
  seqColors.forEach((c, i) => {
    const x = gap * (i + 1)
    s += `<rect x="${x-15}" y="${h/2-25}" width="30" height="50" fill="${c}" rx="6"/>`
    s += `<text x="${x}" y="${h/2+40}" text-anchor="middle" font-family="system-ui" font-size="9" fill="#94A3B8">${names[i]}</text>`
    s += `<text x="${x}" y="${h/2+3}" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="600" fill="white">${i+1}</text>`
  })
  return s
}

function drawMosaic(w, h) {
  let s = ''
  const mosaicColors = [
    ['#3B82F6', '#FFFFFF', '#94A3B8', '#3B82F6'],
    ['#FFFFFF', '#3B82F6', '#3B82F6', '#94A3B8'],
    ['#94A3B8', '#94A3B8', '#FFFFFF', '#3B82F6'],
    ['#3B82F6', '#3B82F6', '#FFFFFF', '#FFFFFF'],
  ]
  const cellSize = 40
  const startX = (w - cellSize * 4 - 12) / 2
  const startY = (h - cellSize * 4 - 12) / 2
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = startX + c * (cellSize + 4)
      const y = startY + r * (cellSize + 4)
      s += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${mosaicColors[r][c]}" rx="4" stroke="#1a2332" stroke-width="2"/>`
    }
  }
  return s
}

function drawThreeVersions(w, h) {
  let s = ''
  const labels = ['Original', 'Versão 2', 'Versão 3']
  for (let v = 0; v < 3; v++) {
    const cx = 55 + v * 100
    const cy = h/2
    s += `<rect x="${cx-35}" y="${cy-50}" width="70" height="80" fill="#243044" rx="6" stroke="#475569" stroke-width="1"/>`
    // Base pattern: circle, triangle, square
    s += `<circle cx="${cx-10}" cy="${cy-25}" r="10" fill="${colors.blue}"/>`
    s += `<polygon points="${cx+10},${cy-35} ${cx},${cy-15} ${cx+20},${cy-15}" fill="${colors.green}"/>`
    s += `<rect x="${cx-18}" y="${cy}" width="16" height="16" fill="${colors.red}" rx="2"/>`
    // Modifications
    if (v === 1) {
      s += `<circle cx="${cx+12}" cy="${cy+8}" r="6" fill="${colors.yellow}"/>` // added element
    }
    if (v === 2) {
      s += `<circle cx="${cx+12}" cy="${cy+8}" r="6" fill="${colors.yellow}"/>` // added
      s += `<line x1="${cx-10}" y1="${cy-30}" x2="${cx-10}" y2="${cy-20}" stroke="${colors.purple}" stroke-width="2"/>` // changed
      s += `<rect x="${cx+2}" y="${cy}" width="16" height="16" fill="${colors.orange}" rx="2"/>` // changed color
    }
    s += `<text x="${cx}" y="${cy+55}" text-anchor="middle" font-family="system-ui" font-size="9" fill="#94A3B8">${labels[v]}</text>`
  }
  return s
}

function drawScene(w, h) {
  let s = ''
  // Table
  s += `<rect x="30" y="${h/2+20}" width="240" height="8" fill="#8B4513" rx="2"/>`
  s += `<rect x="50" y="${h/2+28}" width="6" height="40" fill="#6B3410"/>`
  s += `<rect x="244" y="${h/2+28}" width="6" height="40" fill="#6B3410"/>`
  // Book
  s += `<rect x="60" y="${h/2-5}" width="35" height="25" fill="${colors.blue}" rx="2"/>`
  s += `<line x1="78" y1="${h/2-5}" x2="78" y2="${h/2+20}" stroke="#1E40AF" stroke-width="1.5"/>`
  // Pen
  s += `<rect x="100" y="${h/2+5}" width="30" height="5" fill="#1A1A2E" rx="2"/>`
  s += `<polygon points="130,${h/2+5} 135,${h/2+7.5} 130,${h/2+10}" fill="#F59E0B"/>`
  // Cup (behind pen)
  s += `<rect x="115" y="${h/2-15}" width="18" height="22" fill="#D4A574" rx="3"/>`
  s += `<path d="M133 ${h/2-8} Q142 ${h/2-5} 133 ${h/2}" stroke="#D4A574" stroke-width="2" fill="none"/>`
  // Lamp (corner)
  s += `<rect x="210" y="${h/2-50}" width="6" height="50" fill="#94A3B8"/>`
  s += `<path d="M200 ${h/2-50} Q213 ${h/2-65} 226 ${h/2-50}" fill="${colors.yellow}" opacity="0.8"/>`
  // Clock (wall)
  s += `<circle cx="175" cy="45" r="18" fill="#243044" stroke="#94A3B8" stroke-width="1.5"/>`
  s += `<line x1="175" y1="45" x2="175" y2="33" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>`
  s += `<line x1="175" y1="45" x2="183" y2="48" stroke="#94A3B8" stroke-width="1" stroke-linecap="round"/>`
  // Frame (above table)
  s += `<rect x="60" y="30" width="50" height="35" fill="none" stroke="#94A3B8" stroke-width="1.5" rx="2"/>`
  s += `<polygon points="72,55 85,42 98,55" fill="${colors.green}" opacity="0.5"/>`
  s += `<circle cx="78" cy="42" r="5" fill="${colors.yellow}" opacity="0.5"/>`
  return s
}

function drawLinePattern(w, h) {
  let s = ''
  const nodes = [
    [80, 50], [200, 60], [140, 100], [60, 140], [220, 130],
    [150, 170], [90, 200]
  ]
  // Connections
  const edges = [[0,1],[0,2],[1,2],[2,3],[2,4],[3,5],[4,5],[5,6],[3,6]]
  edges.forEach(([a, b]) => {
    s += `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#475569" stroke-width="2"/>`
  })
  // Nodes
  nodes.forEach(([x, y], i) => {
    s += `<circle cx="${x}" cy="${y}" r="8" fill="${colors.blue}" stroke="#1E40AF" stroke-width="1.5"/>`
    s += `<text x="${x}" y="${y+4}" text-anchor="middle" font-family="system-ui" font-size="9" font-weight="600" fill="white">${i+1}</text>`
  })
  return s
}

function drawShapeFillCombo(w, h) {
  let s = ''
  const combos = [
    { shape: 'circle', fill: 'solid', color: colors.red },
    { shape: 'rect', fill: 'striped', color: colors.blue },
    { shape: 'circle', fill: 'striped', color: colors.green },
    { shape: 'rect', fill: 'solid', color: colors.orange },
    { shape: 'tri', fill: 'empty', color: colors.purple },
  ]
  const gap = w / (combos.length + 1)
  combos.forEach((c, i) => {
    const x = gap * (i + 1), y = h / 2
    const r = 22
    if (c.shape === 'circle') {
      if (c.fill === 'solid') s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.color}"/>`
      else if (c.fill === 'striped') {
        s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c.color}" stroke-width="2"/>`
        for (let l = -r; l < r; l += 6) {
          const dx = Math.sqrt(r * r - l * l)
          s += `<line x1="${x - dx}" y1="${y + l}" x2="${x + dx}" y2="${y + l}" stroke="${c.color}" stroke-width="1.5" opacity="0.5"/>`
        }
      } else {
        s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c.color}" stroke-width="2.5"/>`
      }
    } else if (c.shape === 'rect') {
      if (c.fill === 'solid') s += `<rect x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}" fill="${c.color}" rx="3"/>`
      else if (c.fill === 'striped') {
        s += `<rect x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}" fill="none" stroke="${c.color}" stroke-width="2" rx="3"/>`
        for (let l = 0; l < r * 2; l += 6) {
          s += `<line x1="${x-r}" y1="${y-r+l}" x2="${x+r}" y2="${y-r+l}" stroke="${c.color}" stroke-width="1.5" opacity="0.5"/>`
        }
      } else {
        s += `<rect x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}" fill="none" stroke="${c.color}" stroke-width="2.5" rx="3"/>`
      }
    } else if (c.shape === 'tri') {
      if (c.fill === 'empty') {
        s += `<polygon points="${x},${y-r} ${x-r},${y+r} ${x+r},${y+r}" fill="none" stroke="${c.color}" stroke-width="2.5"/>`
      }
    }
    s += `<text x="${x}" y="${y+r+18}" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748B">${i+1}</text>`
  })
  return s
}

function drawArrowGrid(w, h) {
  let s = ''
  // Row 1 directions: right, up, left, down
  const row1 = [0, 270, 180, 90]
  // Row 2 directions (answer): down, left, up, right
  const row2 = [90, 180, 270, 0]
  const gap = w / 5
  for (let i = 0; i < 4; i++) {
    const x = gap * (i + 1), y1 = h / 2 - 35, y2 = h / 2 + 35
    s += drawArrow(x, y1, row1[i], colors.blue)
    s += drawArrow(x, y2, row2[i], colors.red)
  }
  s += `<text x="15" y="${h/2-32}" font-family="system-ui" font-size="10" fill="#64748B">1ª</text>`
  s += `<text x="15" y="${h/2+38}" font-family="system-ui" font-size="10" fill="#64748B">2ª</text>`
  return s
}

function drawArrow(cx, cy, angle, color) {
  const a = angle * Math.PI / 180
  const len = 18
  const ex = cx + Math.cos(a) * len
  const ey = cy + Math.sin(a) * len
  let s = `<line x1="${cx - Math.cos(a) * len * 0.5}" y1="${cy - Math.sin(a) * len * 0.5}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`
  // Arrowhead
  const ha = 150 * Math.PI / 180
  const hx1 = ex + Math.cos(a + ha) * 8
  const hy1 = ey + Math.sin(a + ha) * 8
  const hx2 = ex + Math.cos(a - ha) * 8
  const hy2 = ey + Math.sin(a - ha) * 8
  s += `<polygon points="${ex},${ey} ${hx1},${hy1} ${hx2},${hy2}" fill="${color}"/>`
  return s
}

function drawComposition(w, h) {
  let s = ''
  // 3 blue circles on top
  for (let i = 0; i < 3; i++) {
    const x = w / 2 - 50 + i * 50
    s += `<circle cx="${x}" cy="60" r="20" fill="${colors.blue}"/>`
  }
  // 2 red squares in middle
  for (let i = 0; i < 2; i++) {
    const x = w / 2 - 35 + i * 70
    s += `<rect x="${x-18}" y="${h/2-18}" width="36" height="36" fill="${colors.red}" rx="4"/>`
  }
  // 1 yellow triangle at bottom
  const bx = w / 2
  s += `<polygon points="${bx},${h-70} ${bx-25},${h-30} ${bx+25},${h-30}" fill="${colors.yellow}"/>`
  // Labels
  s += `<text x="${w/2}" y="25" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748B">Topo</text>`
  s += `<text x="${w/2}" y="${h/2-30}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748B">Meio</text>`
  s += `<text x="${w/2}" y="${h-15}" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748B">Base</text>`
  return s
}

// Generate all patterns
console.log(`Generating ${patterns.length} MVR pattern SVGs to ${outputDir}...`)
for (const p of patterns) {
  const svg = generatePatternSVG(p)
  const filename = `mvr-${String(p.id).padStart(2, '0')}.svg`
  fs.writeFileSync(path.join(outputDir, filename), svg)
  console.log(`  ${filename} - ${p.desc}`)
}
console.log('Done!')
