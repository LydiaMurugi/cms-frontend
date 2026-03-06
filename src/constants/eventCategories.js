export const EVENT_COLORS = {
  Worship: '#2C3E50',
  Music: '#16A085',
  Youth: '#8E44AD',
  Fellowship: '#F39C12'
}

export const getCategoryColor = (cat) =>
  EVENT_COLORS[cat] || '#2C3E50'
