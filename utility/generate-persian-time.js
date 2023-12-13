/**
 * Create a time string in Persian format.
 * @param {Object} date - It must be a date object.
 * @param {boolean} [withTime=false] - An optional flag to add time to returned string.
 */
export default function generatePersianTime(date, withTime = false) {
  let timeString = new Date(date).toLocaleDateString('fa-IR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })

  if (withTime) {
    timeString +=
      ' - ' +
      new Date(date).toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      })
  }

  return timeString
}
