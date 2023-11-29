export default function persianToCalendars(year, month, day, op = {}) {
  const formatOut = gD =>
      'toCal' in op
        ? ((op.calendar = op.toCal),
          new Intl.DateTimeFormat(op.locale ?? 'en', op).format(gD))
        : gD,
    dFormat = new Intl.DateTimeFormat('en-u-ca-persian', {
      dateStyle: 'short',
      timeZone: 'UTC',
    })
  let gD = new Date(Date.UTC(2000, month, day))
  gD = new Date(gD.setUTCDate(gD.getUTCDate() + 226867))
  const gY = gD.getUTCFullYear() - 2000 + year
  gD = new Date(
    (gY < 0 ? '-' : '+') +
      ('00000' + Math.abs(gY)).slice(-6) +
      '-' +
      ('0' + (gD.getUTCMonth() + 1)).slice(-2) +
      '-' +
      ('0' + gD.getUTCDate()).slice(-2),
  )
  let [pM, pD, pY] = [...dFormat.format(gD).split('/')],
    i = 0
  gD = new Date(
    gD.setUTCDate(
      gD.getUTCDate() +
        ~~(
          year * 365.25 +
          month * 30.44 +
          day -
          (pY.split(' ')[0] * 365.25 + pM * 30.44 + pD * 1)
        ) -
        2,
    ),
  )
  while (i < 4) {
    ;[pM, pD, pY] = [...dFormat.format(gD).split('/')]
    if (pD == day && pM == month && pY.split(' ')[0] == year)
      return formatOut(gD)
    gD = new Date(gD.setUTCDate(gD.getUTCDate() + 1))
    i++
  }
  throw new Error('Invalid Persian Date!')
}
