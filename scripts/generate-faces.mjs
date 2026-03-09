/**
 * Generate diverse face SVG illustrations for TSP memory tests
 * Run: node scripts/generate-faces.mjs
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, '..', 'public', 'images', 'faces')
fs.mkdirSync(outputDir, { recursive: true })

function darken(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const nr = Math.max(0, Math.round(r * (1 - amount)))
  const ng = Math.max(0, Math.round(g * (1 - amount)))
  const nb = Math.max(0, Math.round(b * (1 - amount)))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

const faces = [
  // 1-15: TSP Rostos Conhecidos
  { id: 1, skin: '#F5D0A9', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#4A3728', gender: 'M', age: 'mid', beard: 'full', glasses: 'round', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 2, skin: '#D4A574', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#2E86AB', gender: 'M', age: 'young', beard: null, glasses: 'sun', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'serious' },
  { id: 3, skin: '#FFDBB4', hair: '#B22222', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'F', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: true, expression: 'smile' },
  { id: 4, skin: '#E8B88A', hair: '#808080', hairStyle: 'short', eyeColor: '#4A3728', gender: 'M', age: 'old', beard: 'full', glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 5, skin: '#FFDBB4', hair: '#D4A017', hairStyle: 'medium', eyeColor: '#2E86AB', gender: 'F', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: false, fringe: true, freckles: false, expression: 'smile' },
  { id: 6, skin: '#D4A574', hair: '#1A1A2E', hairStyle: 'bald', eyeColor: '#37474F', gender: 'M', age: 'mid', beard: null, glasses: null, hat: null, scar: true, earrings: false, fringe: false, freckles: false, expression: 'serious' },
  { id: 7, skin: '#C68642', hair: '#4A2511', hairStyle: 'medium', eyeColor: '#4A3728', gender: 'F', age: 'mid', beard: null, glasses: 'square', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 8, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'curly', eyeColor: '#5D4037', gender: 'M', age: 'young', beard: 'goatee', glasses: null, hat: 'cap', scar: false, earrings: false, fringe: false, freckles: false, expression: 'smile' },
  { id: 9, skin: '#F5D0A9', hair: '#C4721A', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'F', age: 'mid', beard: null, glasses: null, hat: null, scar: false, earrings: true, fringe: false, freckles: false, expression: 'smile' },
  { id: 10, skin: '#E8B88A', hair: '#2F2F2F', hairStyle: 'short', eyeColor: '#4A3728', gender: 'M', age: 'mid', beard: 'stubble', glasses: null, hat: 'beanie', scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 11, skin: '#FFDBB4', hair: '#1A1A2E', hairStyle: 'ponytail', eyeColor: '#2E86AB', gender: 'F', age: 'young', beard: null, glasses: 'round', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 12, skin: '#D4A574', hair: '#808080', hairStyle: 'short', eyeColor: '#37474F', gender: 'F', age: 'old', beard: null, glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 13, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'buzz', eyeColor: '#5D4037', gender: 'M', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: true, fringe: false, freckles: false, expression: 'smile' },
  { id: 14, skin: '#F5D0A9', hair: '#4A2511', hairStyle: 'medium', eyeColor: '#4A3728', gender: 'F', age: 'mid', beard: null, glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'serious' },
  { id: 15, skin: '#C68642', hair: '#1A1A2E', hairStyle: 'mohawk', eyeColor: '#2E86AB', gender: 'M', age: 'young', beard: 'stubble', glasses: 'square', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  // 16-30: TSP Completo
  { id: 16, skin: '#FFDBB4', hair: '#D4A017', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'F', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: true, fringe: true, freckles: false, expression: 'smile' },
  { id: 17, skin: '#D4A574', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#4A3728', gender: 'M', age: 'mid', beard: 'full', glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 18, skin: '#E8B88A', hair: '#808080', hairStyle: 'short', eyeColor: '#37474F', gender: 'F', age: 'old', beard: null, glasses: 'round', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 19, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'curly', eyeColor: '#5D4037', gender: 'F', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'surprise' },
  { id: 20, skin: '#F5D0A9', hair: '#B22222', hairStyle: 'short', eyeColor: '#2E86AB', gender: 'M', age: 'young', beard: 'goatee', glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'smile' },
  { id: 21, skin: '#C68642', hair: '#4A2511', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'F', age: 'mid', beard: null, glasses: 'square', hat: null, scar: false, earrings: true, fringe: false, freckles: false, expression: 'neutral' },
  { id: 22, skin: '#FFDBB4', hair: '#1A1A2E', hairStyle: 'bald', eyeColor: '#4A3728', gender: 'M', age: 'old', beard: 'stubble', glasses: null, hat: null, scar: true, earrings: false, fringe: false, freckles: false, expression: 'serious' },
  { id: 23, skin: '#D4A574', hair: '#D4A017', hairStyle: 'medium', eyeColor: '#2E86AB', gender: 'F', age: 'young', beard: null, glasses: 'sun', hat: null, scar: false, earrings: false, fringe: true, freckles: false, expression: 'neutral' },
  { id: 24, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#5D4037', gender: 'M', age: 'mid', beard: null, glasses: null, hat: 'cap', scar: false, earrings: false, fringe: false, freckles: false, expression: 'smile' },
  { id: 25, skin: '#F5D0A9', hair: '#C4721A', hairStyle: 'curly', eyeColor: '#1B5E20', gender: 'F', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: true, fringe: false, freckles: true, expression: 'smile' },
  { id: 26, skin: '#E8B88A', hair: '#2F2F2F', hairStyle: 'medium', eyeColor: '#37474F', gender: 'M', age: 'young', beard: 'full', glasses: 'round', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 27, skin: '#C68642', hair: '#1A1A2E', hairStyle: 'ponytail', eyeColor: '#4A3728', gender: 'F', age: 'mid', beard: null, glasses: null, hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'serious' },
  { id: 28, skin: '#FFDBB4', hair: '#4A2511', hairStyle: 'short', eyeColor: '#2E86AB', gender: 'M', age: 'mid', beard: 'goatee', glasses: null, hat: 'beanie', scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 29, skin: '#D4A574', hair: '#808080', hairStyle: 'medium', eyeColor: '#5D4037', gender: 'M', age: 'old', beard: 'full', glasses: 'square', hat: null, scar: false, earrings: false, fringe: false, freckles: false, expression: 'neutral' },
  { id: 30, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#4A3728', gender: 'F', age: 'young', beard: null, glasses: null, hat: null, scar: false, earrings: true, fringe: false, freckles: false, expression: 'smile' },
]

function generateFaceSVG(f) {
  const w = 200, h = 240
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  s += `<rect width="${w}" height="${h}" fill="#1a2332" rx="16"/>`

  const headY = f.hat ? 48 : 42

  // Neck + shoulders
  s += `<rect x="80" y="${headY + 110}" width="40" height="30" fill="${f.skin}" rx="4"/>`
  s += `<ellipse cx="100" cy="${headY + 165}" rx="65" ry="35" fill="#243044"/>`

  // Head
  s += `<ellipse cx="100" cy="${headY + 55}" rx="55" ry="62" fill="${f.skin}"/>`

  // Ears
  s += `<ellipse cx="45" cy="${headY + 58}" rx="8" ry="12" fill="${f.skin}"/>`
  s += `<ellipse cx="155" cy="${headY + 58}" rx="8" ry="12" fill="${f.skin}"/>`

  // Earrings
  if (f.earrings) {
    s += `<circle cx="45" cy="${headY + 73}" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>`
    s += `<circle cx="155" cy="${headY + 73}" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>`
  }

  // Hair
  s += drawHair(f, headY)

  // Eyes
  const ey = headY + 52
  s += `<ellipse cx="78" cy="${ey}" rx="10" ry="7" fill="white"/>`
  s += `<ellipse cx="122" cy="${ey}" rx="10" ry="7" fill="white"/>`

  if (f.glasses !== 'sun') {
    s += `<circle cx="78" cy="${ey}" r="5" fill="${f.eyeColor}"/>`
    s += `<circle cx="122" cy="${ey}" r="5" fill="${f.eyeColor}"/>`
    s += `<circle cx="79" cy="${ey - 1}" r="2" fill="white" opacity="0.6"/>`
    s += `<circle cx="123" cy="${ey - 1}" r="2" fill="white" opacity="0.6"/>`
    s += `<circle cx="78" cy="${ey}" r="2.5" fill="#111"/>`
    s += `<circle cx="122" cy="${ey}" r="2.5" fill="#111"/>`
  }

  // Eyebrows
  const by = ey - 14
  const browC = darken(f.hair, 0.3)
  if (f.expression === 'surprise') {
    s += `<path d="M65 ${by-3} Q78 ${by-9} 90 ${by-3}" stroke="${browC}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    s += `<path d="M110 ${by-3} Q122 ${by-9} 135 ${by-3}" stroke="${browC}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  } else if (f.expression === 'serious') {
    s += `<line x1="65" y1="${by}" x2="90" y2="${by-2}" stroke="${browC}" stroke-width="2.5" stroke-linecap="round"/>`
    s += `<line x1="110" y1="${by-2}" x2="135" y2="${by}" stroke="${browC}" stroke-width="2.5" stroke-linecap="round"/>`
  } else {
    s += `<path d="M65 ${by} Q78 ${by-5} 90 ${by}" stroke="${browC}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    s += `<path d="M110 ${by} Q122 ${by-5} 135 ${by}" stroke="${browC}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  }

  // Glasses
  if (f.glasses) s += drawGlasses(f.glasses, ey)

  // Nose
  const ny = headY + 70
  s += `<path d="M95 ${ny-8} Q100 ${ny+2} 105 ${ny-8}" stroke="${darken(f.skin, 0.15)}" stroke-width="1.5" fill="none"/>`
  s += `<circle cx="93" cy="${ny-4}" r="2" fill="${darken(f.skin, 0.1)}"/>`
  s += `<circle cx="107" cy="${ny-4}" r="2" fill="${darken(f.skin, 0.1)}"/>`

  // Mouth
  const my = headY + 82
  if (f.expression === 'smile') {
    s += `<path d="M82 ${my} Q100 ${my+12} 118 ${my}" stroke="${darken(f.skin, 0.3)}" stroke-width="2" fill="none" stroke-linecap="round"/>`
    s += `<path d="M88 ${my+2} Q100 ${my+10} 112 ${my+2}" fill="white" opacity="0.8"/>`
  } else if (f.expression === 'surprise') {
    s += `<ellipse cx="100" cy="${my+3}" rx="8" ry="10" fill="${darken(f.skin, 0.25)}"/>`
    s += `<ellipse cx="100" cy="${my+3}" rx="6" ry="8" fill="#2a1520"/>`
  } else if (f.expression === 'serious') {
    s += `<line x1="85" y1="${my}" x2="115" y2="${my}" stroke="${darken(f.skin, 0.3)}" stroke-width="2" stroke-linecap="round"/>`
  } else {
    s += `<path d="M85 ${my} Q100 ${my+4} 115 ${my}" stroke="${darken(f.skin, 0.3)}" stroke-width="2" fill="none" stroke-linecap="round"/>`
  }

  // Beard
  if (f.beard) {
    const bc = f.age === 'old' ? '#A0A0A0' : darken(f.hair, 0.2)
    if (f.beard === 'full') {
      s += `<path d="M60 ${headY+65} Q58 ${headY+90} 75 ${headY+108} Q100 ${headY+120} 125 ${headY+108} Q142 ${headY+90} 140 ${headY+65}" fill="${bc}" opacity="0.8"/>`
    } else if (f.beard === 'goatee') {
      s += `<path d="M85 ${headY+80} Q82 ${headY+95} 90 ${headY+105} Q100 ${headY+112} 110 ${headY+105} Q118 ${headY+95} 115 ${headY+80}" fill="${bc}" opacity="0.7"/>`
    } else if (f.beard === 'stubble') {
      for (let y = headY+75; y < headY+105; y += 4) {
        for (let x = 70; x < 130; x += 4) {
          const dx = x-100, dy = y-(headY+90)
          if (dx*dx/(30*30) + dy*dy/(18*18) < 1) {
            s += `<circle cx="${x}" cy="${y}" r="0.8" fill="${bc}" opacity="0.4"/>`
          }
        }
      }
    }
  }

  // Scar
  if (f.scar) {
    s += `<path d="M105 ${headY+92} L110 ${headY+100} L107 ${headY+108}" stroke="#C0A080" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>`
  }

  // Freckles
  if (f.freckles) {
    const fy = headY + 62
    s += `<circle cx="70" cy="${fy}" r="1.2" fill="${darken(f.skin, 0.2)}" opacity="0.5"/>`
    s += `<circle cx="75" cy="${fy+4}" r="1" fill="${darken(f.skin, 0.2)}" opacity="0.45"/>`
    s += `<circle cx="67" cy="${fy+6}" r="1.1" fill="${darken(f.skin, 0.2)}" opacity="0.5"/>`
    s += `<circle cx="73" cy="${fy+8}" r="0.9" fill="${darken(f.skin, 0.2)}" opacity="0.4"/>`
    s += `<circle cx="125" cy="${fy}" r="1.2" fill="${darken(f.skin, 0.2)}" opacity="0.5"/>`
    s += `<circle cx="130" cy="${fy+4}" r="1" fill="${darken(f.skin, 0.2)}" opacity="0.45"/>`
    s += `<circle cx="133" cy="${fy+6}" r="1.1" fill="${darken(f.skin, 0.2)}" opacity="0.5"/>`
    s += `<circle cx="127" cy="${fy+8}" r="0.9" fill="${darken(f.skin, 0.2)}" opacity="0.4"/>`
  }

  // Hat (on top of hair)
  if (f.hat) s += drawHat(f.hat, headY)

  // Age wrinkles
  if (f.age === 'old') {
    const wy = headY + 48
    s += `<path d="M62 ${wy} Q65 ${wy+3} 68 ${wy}" stroke="${darken(f.skin, 0.1)}" stroke-width="0.8" fill="none" opacity="0.4"/>`
    s += `<path d="M132 ${wy} Q135 ${wy+3} 138 ${wy}" stroke="${darken(f.skin, 0.1)}" stroke-width="0.8" fill="none" opacity="0.4"/>`
    s += `<path d="M80 ${headY+86} Q85 ${headY+88} 90 ${headY+86}" stroke="${darken(f.skin, 0.1)}" stroke-width="0.6" fill="none" opacity="0.3"/>`
    s += `<path d="M110 ${headY+86} Q115 ${headY+88} 120 ${headY+86}" stroke="${darken(f.skin, 0.1)}" stroke-width="0.6" fill="none" opacity="0.3"/>`
  }

  // Face number label
  s += `<text x="100" y="${h - 8}" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="600" fill="#475569">Rosto ${f.id}</text>`

  s += '</svg>'
  return s
}

function drawHair(f, headY) {
  let s = ''
  const c = f.hair
  switch (f.hairStyle) {
    case 'short':
      s += `<path d="M48 ${headY+40} Q50 ${headY+8} 100 ${headY} Q150 ${headY+8} 152 ${headY+40}" fill="${c}"/>`
      s += `<ellipse cx="100" cy="${headY+15}" rx="52" ry="22" fill="${c}"/>`
      break
    case 'medium':
      s += `<path d="M45 ${headY+55} Q48 ${headY+5} 100 ${headY-5} Q152 ${headY+5} 155 ${headY+55}" fill="${c}"/>`
      if (f.fringe) s += `<path d="M55 ${headY+30} Q70 ${headY+40} 85 ${headY+35} Q75 ${headY+15} 65 ${headY+20}" fill="${c}"/>`
      break
    case 'long':
      s += `<path d="M42 ${headY+80} Q45 ${headY} 100 ${headY-8} Q155 ${headY} 158 ${headY+80}" fill="${c}"/>`
      s += `<rect x="42" y="${headY+70}" width="18" height="60" fill="${c}" rx="8"/>`
      s += `<rect x="140" y="${headY+70}" width="18" height="60" fill="${c}" rx="8"/>`
      if (f.fringe) s += `<path d="M52 ${headY+30} Q75 ${headY+45} 95 ${headY+35} Q80 ${headY+10} 60 ${headY+15}" fill="${c}"/>`
      break
    case 'bald':
      s += `<ellipse cx="100" cy="${headY+15}" rx="48" ry="15" fill="${darken(f.skin, 0.05)}" opacity="0.3"/>`
      break
    case 'curly':
      s += `<path d="M45 ${headY+55} Q48 ${headY+5} 100 ${headY-5} Q152 ${headY+5} 155 ${headY+55}" fill="${c}"/>`
      for (let i = 0; i < 8; i++) {
        s += `<circle cx="${50+i*14}" cy="${headY+5+Math.sin(i*1.2)*5}" r="8" fill="${c}"/>`
      }
      for (let i = 0; i < 6; i++) {
        s += `<circle cx="${55+i*16}" cy="${headY-5+Math.cos(i*1.5)*4}" r="7" fill="${c}"/>`
      }
      break
    case 'mohawk':
      s += `<path d="M48 ${headY+40} Q50 ${headY+15} 100 ${headY+10} Q150 ${headY+15} 152 ${headY+40}" fill="${darken(f.skin, 0.05)}" opacity="0.3"/>`
      s += `<path d="M85 ${headY+15} Q90 ${headY-20} 100 ${headY-25} Q110 ${headY-20} 115 ${headY+15}" fill="${c}"/>`
      break
    case 'buzz':
      s += `<path d="M48 ${headY+40} Q50 ${headY+10} 100 ${headY+2} Q150 ${headY+10} 152 ${headY+40}" fill="${c}" opacity="0.5"/>`
      break
    case 'ponytail':
      s += `<path d="M48 ${headY+40} Q50 ${headY+5} 100 ${headY-5} Q150 ${headY+5} 152 ${headY+40}" fill="${c}"/>`
      s += `<ellipse cx="100" cy="${headY+12}" rx="50" ry="20" fill="${c}"/>`
      s += `<path d="M140 ${headY+30} Q165 ${headY+40} 160 ${headY+75} Q155 ${headY+90} 145 ${headY+95}" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>`
      break
  }
  return s
}

function drawGlasses(style, ey) {
  let s = ''
  if (style === 'round') {
    s += `<circle cx="78" cy="${ey}" r="14" fill="none" stroke="#333" stroke-width="2"/>`
    s += `<circle cx="122" cy="${ey}" r="14" fill="none" stroke="#333" stroke-width="2"/>`
    s += `<line x1="92" y1="${ey}" x2="108" y2="${ey}" stroke="#333" stroke-width="2"/>`
    s += `<line x1="64" y1="${ey}" x2="45" y2="${ey-4}" stroke="#333" stroke-width="1.5"/>`
    s += `<line x1="136" y1="${ey}" x2="155" y2="${ey-4}" stroke="#333" stroke-width="1.5"/>`
  } else if (style === 'square') {
    s += `<rect x="64" y="${ey-12}" width="28" height="24" rx="3" fill="none" stroke="#333" stroke-width="2"/>`
    s += `<rect x="108" y="${ey-12}" width="28" height="24" rx="3" fill="none" stroke="#333" stroke-width="2"/>`
    s += `<line x1="92" y1="${ey}" x2="108" y2="${ey}" stroke="#333" stroke-width="2"/>`
    s += `<line x1="64" y1="${ey}" x2="45" y2="${ey-4}" stroke="#333" stroke-width="1.5"/>`
    s += `<line x1="136" y1="${ey}" x2="155" y2="${ey-4}" stroke="#333" stroke-width="1.5"/>`
  } else if (style === 'sun') {
    s += `<path d="M62 ${ey-10} Q78 ${ey-14} 92 ${ey-10} L92 ${ey+8} Q78 ${ey+14} 62 ${ey+8} Z" fill="#1A1A2E" stroke="#333" stroke-width="1.5"/>`
    s += `<path d="M108 ${ey-10} Q122 ${ey-14} 138 ${ey-10} L138 ${ey+8} Q122 ${ey+14} 108 ${ey+8} Z" fill="#1A1A2E" stroke="#333" stroke-width="1.5"/>`
    s += `<line x1="92" y1="${ey-2}" x2="108" y2="${ey-2}" stroke="#333" stroke-width="2"/>`
    s += `<line x1="62" y1="${ey-4}" x2="45" y2="${ey-6}" stroke="#333" stroke-width="1.5"/>`
    s += `<line x1="138" y1="${ey-4}" x2="155" y2="${ey-6}" stroke="#333" stroke-width="1.5"/>`
  }
  return s
}

function drawHat(style, headY) {
  let s = ''
  if (style === 'cap') {
    s += `<path d="M40 ${headY+25} Q45 ${headY-5} 100 ${headY-12} Q155 ${headY-5} 160 ${headY+25}" fill="#243044"/>`
    s += `<rect x="38" y="${headY+22}" width="124" height="8" fill="#1a2332" rx="4"/>`
    s += `<path d="M38 ${headY+26} Q20 ${headY+25} 25 ${headY+32} L38 ${headY+30}" fill="#1a2332"/>`
  } else if (style === 'beanie') {
    s += `<path d="M45 ${headY+30} Q48 ${headY-5} 100 ${headY-15} Q152 ${headY-5} 155 ${headY+30}" fill="#2F2F2F"/>`
    s += `<rect x="45" y="${headY+22}" width="110" height="10" fill="#3F3F3F" rx="5"/>`
    s += `<circle cx="100" cy="${headY-15}" r="6" fill="#4F4F4F"/>`
  }
  return s
}

// Generate all faces
console.log(`Generating ${faces.length} face SVGs to ${outputDir}...`)
for (const face of faces) {
  const svg = generateFaceSVG(face)
  const filename = `face-${String(face.id).padStart(2, '0')}.svg`
  fs.writeFileSync(path.join(outputDir, filename), svg)
  console.log(`  ${filename}`)
}
console.log('Done!')
