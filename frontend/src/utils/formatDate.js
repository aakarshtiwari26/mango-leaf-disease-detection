const IST_TIME_ZONE = 'Asia/Kolkata'

export function formatISTDateTime(dateInput) {
  const date = new Date(dateInput)
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
