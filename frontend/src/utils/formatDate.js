const IST_TIME_ZONE = 'Asia/Kolkata'
const HAS_TIMEZONE_MARKER = /(Z|[+-]\d{2}:?\d{2})$/

// A timestamp with no explicit offset (e.g. "2026-08-19T17:47:32") gets
// parsed by the browser as local time rather than UTC. Our backend always
// sends UTC, so treat a bare timestamp as UTC by appending "Z".
function toUtcSafeString(dateInput) {
  if (typeof dateInput === 'string' && !HAS_TIMEZONE_MARKER.test(dateInput)) {
    return `${dateInput}Z`
  }
  return dateInput
}

export function formatISTDateTime(dateInput) {
  const date = new Date(toUtcSafeString(dateInput))
  const datePart = date
    .toLocaleDateString('en-US', {
      timeZone: IST_TIME_ZONE,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .replace(',', '')
  const timePart = date.toLocaleTimeString('en-US', {
    timeZone: IST_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${datePart} - ${timePart}`
}
