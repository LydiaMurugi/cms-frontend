export const RESOURCE_CATEGORIES = [
  'Sermon Audio',
  'Sermon Notes (PDF)',
  'Study Guide',
  'Youth Media',
  'Event Photos',
]

// Project-wide Fallback: Realistic Church Building (User Selection)
export const DEFAULT_CHURCH_IMAGE = 'https://img.freepik.com/premium-photo/handmade-church-texture-background-holy-place_926199-4387514.jpg?w=360'

// Inspiring Bible Verses for Placeholders
export const BIBLE_VERSES = [
  "Faith comes by hearing, and hearing by the word of God. — Romans 10:17",
  "The Lord is my shepherd; I shall not want. — Psalm 23:1",
  "For where two or three are gathered in my name, there am I among them. — Matthew 18:20",
  "Let all that you do be done in love. — 1 Corinthians 16:14",
  "I can do all things through Christ who strengthens me. — Philippians 4:13"
]

export const getRandomVerse = () => BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]
