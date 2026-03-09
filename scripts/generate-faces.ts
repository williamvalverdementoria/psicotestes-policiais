/**
 * Generate diverse face SVG illustrations for TSP memory tests
 * Run: npx tsx scripts/generate-faces.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = 'https://esieszjuycuqleyqqdkb.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

if (!SUPABASE_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Face Feature Definitions ───
const skinTones = ['#F5D0A9', '#D4A574', '#8D5524', '#C68642', '#E8B88A', '#FFDBB4']
const hairColors = ['#1A1A2E', '#4A2511', '#8B4513', '#C4721A', '#D4A017', '#B22222', '#2F2F2F', '#808080']
const eyeColors = ['#4A3728', '#2E86AB', '#1B5E20', '#5D4037', '#37474F']

interface FaceConfig {
  id: number
  skin: string
  hair: string
  hairStyle: 'short' | 'medium' | 'long' | 'bald' | 'curly' | 'mohawk' | 'buzz' | 'ponytail'
  eyeColor: string
  gender: 'male' | 'female'
  age: 'young' | 'middle' | 'old'
  hasBeard: boolean
  beardStyle?: 'full' | 'goatee' | 'stubble'
  hasGlasses: boolean
  glassesStyle?: 'round' | 'square' | 'sunglasses'
  hasHat: boolean
  hatStyle?: 'cap' | 'beanie'
  hasScar: boolean
  hasEarrings: boolean
  hasFringe: boolean
  expression: 'neutral' | 'smile' | 'serious' | 'surprise'
  features: string[] // text description for question matching
}

// Generate 30 diverse face configurations
function generateFaceConfigs(): FaceConfig[] {
  const configs: FaceConfig[] = [
    // TSP - Rostos Conhecidos (faces 1-15)
    { id: 1, skin: '#F5D0A9', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#4A3728', gender: 'male', age: 'middle', hasBeard: true, beardStyle: 'full', hasGlasses: true, glassesStyle: 'round', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['barba espessa', 'óculos redondos', 'cabelo curto escuro'] },
    { id: 2, skin: '#D4A574', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#2E86AB', gender: 'male', age: 'young', hasBeard: false, hasGlasses: true, glassesStyle: 'sunglasses', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'serious',
      features: ['óculos escuros', 'cabelo curto', 'expressão séria'] },
    { id: 3, skin: '#FFDBB4', hair: '#B22222', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'female', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'smile',
      features: ['cabelo ruivo', 'sardas', 'mulher jovem'] },
    { id: 4, skin: '#E8B88A', hair: '#808080', hairStyle: 'short', eyeColor: '#4A3728', gender: 'male', age: 'old', hasBeard: true, beardStyle: 'full', hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['homem idoso', 'barba branca', 'cabelo grisalho'] },
    { id: 5, skin: '#FFDBB4', hair: '#D4A017', hairStyle: 'medium', eyeColor: '#2E86AB', gender: 'female', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: true, expression: 'smile',
      features: ['franja loira', 'criança/jovem', 'sorridente'] },
    { id: 6, skin: '#D4A574', hair: '#1A1A2E', hairStyle: 'bald', eyeColor: '#37474F', gender: 'male', age: 'middle', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: true, hasEarrings: false, hasFringe: false, expression: 'serious',
      features: ['homem careca', 'cicatriz no queixo', 'expressão séria'] },
    { id: 7, skin: '#C68642', hair: '#4A2511', hairStyle: 'medium', eyeColor: '#4A3728', gender: 'female', age: 'middle', hasBeard: false, hasGlasses: true, glassesStyle: 'square', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['mulher de óculos', 'cabelo médio castanho'] },
    { id: 8, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'curly', eyeColor: '#5D4037', gender: 'male', age: 'young', hasBeard: true, beardStyle: 'goatee', hasGlasses: false, hasHat: true, hatStyle: 'cap', hasScar: false, hasEarrings: false, hasFringe: false, expression: 'smile',
      features: ['homem com boné', 'barba cavanhaque', 'cabelo cacheado'] },
    { id: 9, skin: '#F5D0A9', hair: '#C4721A', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'female', age: 'middle', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: true, hasFringe: false, expression: 'smile',
      features: ['brincos grandes', 'cabelo ruivo longo', 'sorriso'] },
    { id: 10, skin: '#E8B88A', hair: '#2F2F2F', hairStyle: 'short', eyeColor: '#4A3728', gender: 'male', age: 'middle', hasBeard: true, beardStyle: 'stubble', hasGlasses: false, hasHat: true, hatStyle: 'beanie', hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['homem com chapéu/gorro', 'barba rala'] },
    { id: 11, skin: '#FFDBB4', hair: '#1A1A2E', hairStyle: 'ponytail', eyeColor: '#2E86AB', gender: 'female', age: 'young', hasBeard: false, hasGlasses: true, glassesStyle: 'round', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['mulher de óculos redondos', 'rabo de cavalo'] },
    { id: 12, skin: '#D4A574', hair: '#808080', hairStyle: 'short', eyeColor: '#37474F', gender: 'female', age: 'old', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['idosa', 'cabelo grisalho curto'] },
    { id: 13, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'buzz', eyeColor: '#5D4037', gender: 'male', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: true, hasFringe: false, expression: 'smile',
      features: ['jovem com piercing/brinco', 'cabelo raspado'] },
    { id: 14, skin: '#F5D0A9', hair: '#4A2511', hairStyle: 'medium', eyeColor: '#4A3728', gender: 'female', age: 'middle', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'serious',
      features: ['mulher com lenço/cabelo castanho', 'expressão séria'] },
    { id: 15, skin: '#C68642', hair: '#1A1A2E', hairStyle: 'mohawk', eyeColor: '#2E86AB', gender: 'male', age: 'young', hasBeard: true, beardStyle: 'stubble', hasGlasses: true, glassesStyle: 'square', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['cabelo moicano', 'óculos quadrados', 'barba rala'] },

    // TSP - Completo (faces 16-30)
    { id: 16, skin: '#FFDBB4', hair: '#D4A017', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'female', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: true, hasFringe: true, expression: 'smile',
      features: ['mulher loira', 'sorriso aberto', 'brincos'] },
    { id: 17, skin: '#D4A574', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#4A3728', gender: 'male', age: 'middle', hasBeard: true, beardStyle: 'full', hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['homem moreno', 'barba cheia', 'expressão neutra'] },
    { id: 18, skin: '#E8B88A', hair: '#808080', hairStyle: 'short', eyeColor: '#37474F', gender: 'female', age: 'old', hasBeard: false, hasGlasses: true, glassesStyle: 'round', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['idosa de cabelo grisalho', 'óculos redondos'] },
    { id: 19, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'curly', eyeColor: '#5D4037', gender: 'female', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'surprise',
      features: ['mulher cabelo cacheado', 'expressão surpresa'] },
    { id: 20, skin: '#F5D0A9', hair: '#B22222', hairStyle: 'short', eyeColor: '#2E86AB', gender: 'male', age: 'young', hasBeard: true, beardStyle: 'goatee', hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'smile',
      features: ['barba ruiva', 'cavanhaque', 'olhos azuis'] },
    { id: 21, skin: '#C68642', hair: '#4A2511', hairStyle: 'long', eyeColor: '#1B5E20', gender: 'female', age: 'middle', hasBeard: false, hasGlasses: true, glassesStyle: 'square', hasHat: false, hasScar: false, hasEarrings: true, hasFringe: false, expression: 'neutral',
      features: ['mulher óculos quadrados', 'cabelo longo castanho', 'brincos'] },
    { id: 22, skin: '#FFDBB4', hair: '#1A1A2E', hairStyle: 'bald', eyeColor: '#4A3728', gender: 'male', age: 'old', hasBeard: true, beardStyle: 'stubble', hasGlasses: false, hasHat: false, hasScar: true, hasEarrings: false, hasFringe: false, expression: 'serious',
      features: ['idoso careca', 'barba rala', 'cicatriz'] },
    { id: 23, skin: '#D4A574', hair: '#D4A017', hairStyle: 'medium', eyeColor: '#2E86AB', gender: 'female', age: 'young', hasBeard: false, hasGlasses: true, glassesStyle: 'sunglasses', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: true, expression: 'neutral',
      features: ['mulher loira', 'óculos de sol', 'franja'] },
    { id: 24, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#5D4037', gender: 'male', age: 'middle', hasBeard: false, hasGlasses: false, hasHat: true, hatStyle: 'cap', hasScar: false, hasEarrings: false, hasFringe: false, expression: 'smile',
      features: ['homem com boné', 'sem barba', 'sorridente'] },
    { id: 25, skin: '#F5D0A9', hair: '#C4721A', hairStyle: 'curly', eyeColor: '#1B5E20', gender: 'female', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: true, hasFringe: false, expression: 'smile',
      features: ['cabelo cacheado ruivo', 'brincos', 'sardas'] },
    { id: 26, skin: '#E8B88A', hair: '#2F2F2F', hairStyle: 'medium', eyeColor: '#37474F', gender: 'male', age: 'young', hasBeard: true, beardStyle: 'full', hasGlasses: true, glassesStyle: 'round', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['barba cheia', 'óculos redondos', 'jovem'] },
    { id: 27, skin: '#C68642', hair: '#1A1A2E', hairStyle: 'ponytail', eyeColor: '#4A3728', gender: 'female', age: 'middle', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'serious',
      features: ['mulher rabo de cavalo', 'expressão séria'] },
    { id: 28, skin: '#FFDBB4', hair: '#4A2511', hairStyle: 'short', eyeColor: '#2E86AB', gender: 'male', age: 'middle', hasBeard: true, beardStyle: 'goatee', hasGlasses: false, hasHat: true, hatStyle: 'beanie', hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['boina/gorro preto', 'cavanhaque', 'olhos azuis'] },
    { id: 29, skin: '#D4A574', hair: '#808080', hairStyle: 'medium', eyeColor: '#5D4037', gender: 'male', age: 'old', hasBeard: true, beardStyle: 'full', hasGlasses: true, glassesStyle: 'square', hasHat: false, hasScar: false, hasEarrings: false, hasFringe: false, expression: 'neutral',
      features: ['barba grisalha', 'óculos quadrados', 'idoso'] },
    { id: 30, skin: '#8D5524', hair: '#1A1A2E', hairStyle: 'short', eyeColor: '#4A3728', gender: 'female', age: 'young', hasBeard: false, hasGlasses: false, hasHat: false, hasScar: false, hasEarrings: true, hasFringe: false, expression: 'smile',
      features: ['mulher jovem', 'brincos', 'cabelo curto escuro'] },
  ]
  return configs
}

// ─── SVG Face Generator ───
function generateFaceSVG(face: FaceConfig): string {
  const w = 200, h = 240
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`

  // Background
  svg += `<rect width="${w}" height="${h}" fill="#1a2332" rx="16"/>`

  // Neck
  svg += `<rect x="80" y="155" width="40" height="30" fill="${face.skin}" rx="4"/>`

  // Shoulders hint
  svg += `<ellipse cx="100" cy="210" rx="65" ry="35" fill="#243044"/>`

  // Head shape
  const headY = face.hasHat ? 48 : 42
  svg += `<ellipse cx="100" cy="${headY + 55}" rx="55" ry="62" fill="${face.skin}"/>`

  // Ears
  svg += `<ellipse cx="45" cy="${headY + 58}" rx="8" ry="12" fill="${face.skin}"/>`
  svg += `<ellipse cx="155" cy="${headY + 58}" rx="8" ry="12" fill="${face.skin}"/>`

  // Earrings
  if (face.hasEarrings) {
    svg += `<circle cx="45" cy="${headY + 73}" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>`
    svg += `<circle cx="155" cy="${headY + 73}" r="4" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>`
  }

  // Hair
  svg += generateHair(face, headY)

  // Eyes
  const eyeY = headY + 52
  // Eye whites
  svg += `<ellipse cx="78" cy="${eyeY}" rx="10" ry="7" fill="white"/>`
  svg += `<ellipse cx="122" cy="${eyeY}" rx="10" ry="7" fill="white"/>`

  // Iris
  if (face.glassesStyle !== 'sunglasses') {
    svg += `<circle cx="78" cy="${eyeY}" r="5" fill="${face.eyeColor}"/>`
    svg += `<circle cx="122" cy="${eyeY}" r="5" fill="${face.eyeColor}"/>`
    svg += `<circle cx="79" cy="${eyeY - 1}" r="2" fill="white" opacity="0.6"/>`
    svg += `<circle cx="123" cy="${eyeY - 1}" r="2" fill="white" opacity="0.6"/>`
    // Pupils
    svg += `<circle cx="78" cy="${eyeY}" r="2.5" fill="#111"/>`
    svg += `<circle cx="122" cy="${eyeY}" r="2.5" fill="#111"/>`
  }

  // Eyebrows
  const browY = eyeY - 14
  if (face.expression === 'surprise') {
    svg += `<path d="M65 ${browY - 3} Q78 ${browY - 9} 90 ${browY - 3}" stroke="${darken(face.hair, 0.3)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    svg += `<path d="M110 ${browY - 3} Q122 ${browY - 9} 135 ${browY - 3}" stroke="${darken(face.hair, 0.3)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  } else if (face.expression === 'serious') {
    svg += `<line x1="65" y1="${browY}" x2="90" y2="${browY - 2}" stroke="${darken(face.hair, 0.3)}" stroke-width="2.5" stroke-linecap="round"/>`
    svg += `<line x1="110" y1="${browY - 2}" x2="135" y2="${browY}" stroke="${darken(face.hair, 0.3)}" stroke-width="2.5" stroke-linecap="round"/>`
  } else {
    svg += `<path d="M65 ${browY} Q78 ${browY - 5} 90 ${browY}" stroke="${darken(face.hair, 0.3)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    svg += `<path d="M110 ${browY} Q122 ${browY - 5} 135 ${browY}" stroke="${darken(face.hair, 0.3)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  }

  // Glasses
  if (face.hasGlasses) {
    svg += generateGlasses(face, eyeY)
  }

  // Nose
  const noseY = headY + 70
  svg += `<path d="M95 ${noseY - 8} Q100 ${noseY + 2} 105 ${noseY - 8}" stroke="${darken(face.skin, 0.15)}" stroke-width="1.5" fill="none"/>`
  svg += `<circle cx="93" cy="${noseY - 4}" r="2" fill="${darken(face.skin, 0.1)}"/>`
  svg += `<circle cx="107" cy="${noseY - 4}" r="2" fill="${darken(face.skin, 0.1)}"/>`

  // Mouth
  const mouthY = headY + 82
  svg += generateMouth(face, mouthY)

  // Beard
  if (face.hasBeard) {
    svg += generateBeard(face, headY)
  }

  // Scar
  if (face.hasScar) {
    svg += `<path d="M105 ${headY + 92} L110 ${headY + 100} L107 ${headY + 108}" stroke="#C0A080" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>`
  }

  // Freckles
  if (face.features.some(f => f.includes('sardas'))) {
    const fy = headY + 62
    svg += `<circle cx="70" cy="${fy}" r="1" fill="${darken(face.skin, 0.2)}" opacity="0.4"/>`
    svg += `<circle cx="75" cy="${fy + 4}" r="1" fill="${darken(face.skin, 0.2)}" opacity="0.4"/>`
    svg += `<circle cx="67" cy="${fy + 6}" r="1" fill="${darken(face.skin, 0.2)}" opacity="0.4"/>`
    svg += `<circle cx="125" cy="${fy}" r="1" fill="${darken(face.skin, 0.2)}" opacity="0.4"/>`
    svg += `<circle cx="130" cy="${fy + 4}" r="1" fill="${darken(face.skin, 0.2)}" opacity="0.4"/>`
    svg += `<circle cx="133" cy="${fy + 6}" r="1" fill="${darken(face.skin, 0.2)}" opacity="0.4"/>`
  }

  // Hat (on top)
  if (face.hasHat) {
    svg += generateHat(face, headY)
  }

  // Age wrinkles
  if (face.age === 'old') {
    const wy = headY + 48
    svg += `<path d="M62 ${wy} Q65 ${wy + 3} 68 ${wy}" stroke="${darken(face.skin, 0.1)}" stroke-width="0.8" fill="none" opacity="0.4"/>`
    svg += `<path d="M132 ${wy} Q135 ${wy + 3} 138 ${wy}" stroke="${darken(face.skin, 0.1)}" stroke-width="0.8" fill="none" opacity="0.4"/>`
    svg += `<path d="M80 ${headY + 86} Q85 ${headY + 88} 90 ${headY + 86}" stroke="${darken(face.skin, 0.1)}" stroke-width="0.6" fill="none" opacity="0.3"/>`
    svg += `<path d="M110 ${headY + 86} Q115 ${headY + 88} 120 ${headY + 86}" stroke="${darken(face.skin, 0.1)}" stroke-width="0.6" fill="none" opacity="0.3"/>`
  }

  svg += '</svg>'
  return svg
}

function generateHair(face: FaceConfig, headY: number): string {
  let svg = ''
  const color = face.hair

  switch (face.hairStyle) {
    case 'short':
      svg += `<path d="M48 ${headY + 40} Q50 ${headY + 8} 100 ${headY} Q150 ${headY + 8} 152 ${headY + 40}" fill="${color}"/>`
      svg += `<ellipse cx="100" cy="${headY + 15}" rx="52" ry="22" fill="${color}"/>`
      break
    case 'medium':
      svg += `<path d="M45 ${headY + 55} Q48 ${headY + 5} 100 ${headY - 5} Q152 ${headY + 5} 155 ${headY + 55}" fill="${color}"/>`
      if (face.hasFringe) {
        svg += `<path d="M55 ${headY + 30} Q70 ${headY + 40} 85 ${headY + 35} Q75 ${headY + 15} 65 ${headY + 20}" fill="${color}"/>`
      }
      break
    case 'long':
      svg += `<path d="M42 ${headY + 80} Q45 ${headY} 100 ${headY - 8} Q155 ${headY} 158 ${headY + 80}" fill="${color}"/>`
      svg += `<rect x="42" y="${headY + 70}" width="18" height="60" fill="${color}" rx="8"/>`
      svg += `<rect x="140" y="${headY + 70}" width="18" height="60" fill="${color}" rx="8"/>`
      if (face.hasFringe) {
        svg += `<path d="M52 ${headY + 30} Q75 ${headY + 45} 95 ${headY + 35} Q80 ${headY + 10} 60 ${headY + 15}" fill="${color}"/>`
      }
      break
    case 'bald':
      // Just a slight shadow on top
      svg += `<ellipse cx="100" cy="${headY + 15}" rx="48" ry="15" fill="${darken(face.skin, 0.05)}" opacity="0.3"/>`
      break
    case 'curly':
      svg += `<path d="M45 ${headY + 55} Q48 ${headY + 5} 100 ${headY - 5} Q152 ${headY + 5} 155 ${headY + 55}" fill="${color}"/>`
      // Curly bumps
      for (let i = 0; i < 8; i++) {
        const cx = 50 + i * 14
        const cy = headY + 5 + Math.sin(i * 1.2) * 5
        svg += `<circle cx="${cx}" cy="${cy}" r="8" fill="${color}"/>`
      }
      for (let i = 0; i < 6; i++) {
        const cx = 55 + i * 16
        const cy = headY - 5 + Math.cos(i * 1.5) * 4
        svg += `<circle cx="${cx}" cy="${cy}" r="7" fill="${color}"/>`
      }
      break
    case 'mohawk':
      svg += `<path d="M48 ${headY + 40} Q50 ${headY + 15} 100 ${headY + 10} Q150 ${headY + 15} 152 ${headY + 40}" fill="${darken(face.skin, 0.05)}" opacity="0.3"/>`
      svg += `<path d="M85 ${headY + 15} Q90 ${headY - 20} 100 ${headY - 25} Q110 ${headY - 20} 115 ${headY + 15}" fill="${color}"/>`
      break
    case 'buzz':
      svg += `<path d="M48 ${headY + 40} Q50 ${headY + 10} 100 ${headY + 2} Q150 ${headY + 10} 152 ${headY + 40}" fill="${color}" opacity="0.5"/>`
      break
    case 'ponytail':
      svg += `<path d="M48 ${headY + 40} Q50 ${headY + 5} 100 ${headY - 5} Q150 ${headY + 5} 152 ${headY + 40}" fill="${color}"/>`
      svg += `<ellipse cx="100" cy="${headY + 12}" rx="50" ry="20" fill="${color}"/>`
      // Ponytail
      svg += `<path d="M140 ${headY + 30} Q165 ${headY + 40} 160 ${headY + 75} Q155 ${headY + 90} 145 ${headY + 95}" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round"/>`
      break
  }
  return svg
}

function generateGlasses(face: FaceConfig, eyeY: number): string {
  let svg = ''
  const style = face.glassesStyle || 'round'

  switch (style) {
    case 'round':
      svg += `<circle cx="78" cy="${eyeY}" r="14" fill="none" stroke="#333" stroke-width="2"/>`
      svg += `<circle cx="122" cy="${eyeY}" r="14" fill="none" stroke="#333" stroke-width="2"/>`
      svg += `<line x1="92" y1="${eyeY}" x2="108" y2="${eyeY}" stroke="#333" stroke-width="2"/>`
      svg += `<line x1="64" y1="${eyeY}" x2="45" y2="${eyeY - 4}" stroke="#333" stroke-width="1.5"/>`
      svg += `<line x1="136" y1="${eyeY}" x2="155" y2="${eyeY - 4}" stroke="#333" stroke-width="1.5"/>`
      break
    case 'square':
      svg += `<rect x="64" y="${eyeY - 12}" width="28" height="24" rx="3" fill="none" stroke="#333" stroke-width="2"/>`
      svg += `<rect x="108" y="${eyeY - 12}" width="28" height="24" rx="3" fill="none" stroke="#333" stroke-width="2"/>`
      svg += `<line x1="92" y1="${eyeY}" x2="108" y2="${eyeY}" stroke="#333" stroke-width="2"/>`
      svg += `<line x1="64" y1="${eyeY}" x2="45" y2="${eyeY - 4}" stroke="#333" stroke-width="1.5"/>`
      svg += `<line x1="136" y1="${eyeY}" x2="155" y2="${eyeY - 4}" stroke="#333" stroke-width="1.5"/>`
      break
    case 'sunglasses':
      svg += `<path d="M62 ${eyeY - 10} Q78 ${eyeY - 14} 92 ${eyeY - 10} L92 ${eyeY + 8} Q78 ${eyeY + 14} 62 ${eyeY + 8} Z" fill="#1A1A2E" stroke="#333" stroke-width="1.5"/>`
      svg += `<path d="M108 ${eyeY - 10} Q122 ${eyeY - 14} 138 ${eyeY - 10} L138 ${eyeY + 8} Q122 ${eyeY + 14} 108 ${eyeY + 8} Z" fill="#1A1A2E" stroke="#333" stroke-width="1.5"/>`
      svg += `<line x1="92" y1="${eyeY - 2}" x2="108" y2="${eyeY - 2}" stroke="#333" stroke-width="2"/>`
      svg += `<line x1="62" y1="${eyeY - 4}" x2="45" y2="${eyeY - 6}" stroke="#333" stroke-width="1.5"/>`
      svg += `<line x1="138" y1="${eyeY - 4}" x2="155" y2="${eyeY - 6}" stroke="#333" stroke-width="1.5"/>`
      break
  }
  return svg
}

function generateMouth(face: FaceConfig, mouthY: number): string {
  let svg = ''
  switch (face.expression) {
    case 'smile':
      svg += `<path d="M82 ${mouthY} Q100 ${mouthY + 12} 118 ${mouthY}" stroke="${darken(face.skin, 0.3)}" stroke-width="2" fill="none" stroke-linecap="round"/>`
      // Teeth hint
      svg += `<path d="M88 ${mouthY + 2} Q100 ${mouthY + 10} 112 ${mouthY + 2}" fill="white" opacity="0.8"/>`
      break
    case 'surprise':
      svg += `<ellipse cx="100" cy="${mouthY + 3}" rx="8" ry="10" fill="${darken(face.skin, 0.25)}"/>`
      svg += `<ellipse cx="100" cy="${mouthY + 3}" rx="6" ry="8" fill="#2a1520"/>`
      break
    case 'serious':
      svg += `<line x1="85" y1="${mouthY}" x2="115" y2="${mouthY}" stroke="${darken(face.skin, 0.3)}" stroke-width="2" stroke-linecap="round"/>`
      break
    default: // neutral
      svg += `<path d="M85 ${mouthY} Q100 ${mouthY + 4} 115 ${mouthY}" stroke="${darken(face.skin, 0.3)}" stroke-width="2" fill="none" stroke-linecap="round"/>`
      break
  }
  return svg
}

function generateBeard(face: FaceConfig, headY: number): string {
  let svg = ''
  const beardColor = face.age === 'old' ? '#A0A0A0' : darken(face.hair, 0.2)

  switch (face.beardStyle) {
    case 'full':
      svg += `<path d="M60 ${headY + 65} Q58 ${headY + 90} 75 ${headY + 108} Q100 ${headY + 120} 125 ${headY + 108} Q142 ${headY + 90} 140 ${headY + 65}" fill="${beardColor}" opacity="0.8"/>`
      break
    case 'goatee':
      svg += `<path d="M85 ${headY + 80} Q82 ${headY + 95} 90 ${headY + 105} Q100 ${headY + 112} 110 ${headY + 105} Q118 ${headY + 95} 115 ${headY + 80}" fill="${beardColor}" opacity="0.7"/>`
      break
    case 'stubble':
      // Dots pattern for stubble
      for (let y = headY + 75; y < headY + 105; y += 4) {
        for (let x = 70; x < 130; x += 4) {
          const dx = x - 100, dy = y - (headY + 90)
          if (dx * dx / (30 * 30) + dy * dy / (18 * 18) < 1) {
            svg += `<circle cx="${x}" cy="${y}" r="0.8" fill="${beardColor}" opacity="0.4"/>`
          }
        }
      }
      break
  }
  return svg
}

function generateHat(face: FaceConfig, headY: number): string {
  let svg = ''
  switch (face.hatStyle) {
    case 'cap':
      svg += `<path d="M40 ${headY + 25} Q45 ${headY - 5} 100 ${headY - 12} Q155 ${headY - 5} 160 ${headY + 25}" fill="#243044"/>`
      svg += `<rect x="38" y="${headY + 22}" width="124" height="8" fill="#1a2332" rx="4"/>`
      // Brim
      svg += `<path d="M38 ${headY + 26} Q20 ${headY + 25} 25 ${headY + 32} L38 ${headY + 30}" fill="#1a2332"/>`
      break
    case 'beanie':
      svg += `<path d="M45 ${headY + 30} Q48 ${headY - 5} 100 ${headY - 15} Q152 ${headY - 5} 155 ${headY + 30}" fill="#2F2F2F"/>`
      svg += `<rect x="45" y="${headY + 22}" width="110" height="10" fill="#3F3F3F" rx="5"/>`
      // Small pom on top
      svg += `<circle cx="100" cy="${headY - 15}" r="6" fill="#4F4F4F"/>`
      break
  }
  return svg
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const nr = Math.max(0, Math.round(r * (1 - amount)))
  const ng = Math.max(0, Math.round(g * (1 - amount)))
  const nb = Math.max(0, Math.round(b * (1 - amount)))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

// ─── Upload & Database Update ───
async function main() {
  const configs = generateFaceConfigs()
  const outputDir = path.join(__dirname, '..', 'generated-faces')
  fs.mkdirSync(outputDir, { recursive: true })

  console.log(`Generating ${configs.length} face SVGs...`)

  const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/test-images`

  // Exercise IDs for TSP tests
  const TSP_ROSTOS_ID = 'a1000001-0000-0000-0000-000000000013'
  const TSP_COMPLETO_ID = 'a1000001-0000-0000-0000-000000000014'

  for (const face of configs) {
    const svg = generateFaceSVG(face)
    const filename = `face-${String(face.id).padStart(2, '0')}.svg`
    const localPath = path.join(outputDir, filename)

    // Save locally
    fs.writeFileSync(localPath, svg)
    console.log(`  Generated ${filename} (${face.features.join(', ')})`)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('test-images')
      .upload(`faces/${filename}`, Buffer.from(svg), {
        contentType: 'image/svg+xml',
        upsert: true,
      })

    if (uploadError) {
      console.error(`  Upload failed for ${filename}:`, uploadError.message)
      continue
    }

    const publicUrl = `${storageUrl}/faces/${filename}`
    console.log(`  Uploaded: ${publicUrl}`)
  }

  // Now get questions and update imagem_url
  console.log('\nUpdating question imagem_url...')

  // TSP Rostos Conhecidos - assign faces 1-15
  const { data: rostosQuestions } = await supabase
    .from('questoes')
    .select('id, numero')
    .eq('exercicio_id', TSP_ROSTOS_ID)
    .order('numero')

  if (rostosQuestions) {
    for (const q of rostosQuestions) {
      const faceId = q.numero // face 1-15
      const url = `${storageUrl}/faces/face-${String(faceId).padStart(2, '0')}.svg`
      const { error } = await supabase
        .from('questoes')
        .update({ imagem_url: url })
        .eq('id', q.id)

      if (error) {
        console.error(`  Failed to update question ${q.numero}:`, error.message)
      } else {
        console.log(`  TSP Rostos Q${q.numero} → face-${String(faceId).padStart(2, '0')}.svg`)
      }
    }
  }

  // TSP Completo - assign faces 16-30
  const { data: completoQuestions } = await supabase
    .from('questoes')
    .select('id, numero')
    .eq('exercicio_id', TSP_COMPLETO_ID)
    .order('numero')

  if (completoQuestions) {
    for (const q of completoQuestions) {
      const faceId = q.numero + 15 // face 16-30
      const url = `${storageUrl}/faces/face-${String(faceId).padStart(2, '0')}.svg`
      const { error } = await supabase
        .from('questoes')
        .update({ imagem_url: url })
        .eq('id', q.id)

      if (error) {
        console.error(`  Failed to update question ${q.numero}:`, error.message)
      } else {
        console.log(`  TSP Completo Q${q.numero} → face-${String(faceId).padStart(2, '0')}.svg`)
      }
    }
  }

  console.log('\nDone! Face images generated and uploaded.')
}

main().catch(console.error)
