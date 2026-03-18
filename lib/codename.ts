const adjectives = [
  'swift', 'silent', 'clever', 'bold', 'nimble',
  'sharp', 'sneaky', 'cunning', 'sly', 'agile',
  'daring', 'sleek', 'crafty', 'quick', 'slick',
]

const nouns = [
  'fox', 'raven', 'cipher', 'ghost', 'phantom',
  'shadow', 'viper', 'wolf', 'lynx', 'cobra',
  'falcon', 'jaguar', 'panther', 'hawk', 'eagle',
]

const roles = [
  'agent', 'operative', 'runner', 'handler', 'scout',
  'broker', 'courier', 'fixer', 'thief', 'hacker',
  'spy', 'asset', 'contact', 'mole', 'decoy',
]

function capitalise(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function pick(words: string[]) {
  return words[Math.floor(Math.random() * words.length)]
}

export function generateCodename() {
  return capitalise(pick(adjectives)) + capitalise(pick(nouns)) + capitalise(pick(roles))
}

export { adjectives, nouns, roles }
