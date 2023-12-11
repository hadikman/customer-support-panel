import connect from 'database'

const aliasNameForDatabase = {
  mobileNumber: 'bis',
  phoneNumber: 'bas',
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let {body} = req
    const client = await connect()

    let formattedData = {}

    for (const key in body) {
      let value = body[key]
      let newKey = key

      if (aliasNameForDatabase[key]) {
        newKey = aliasNameForDatabase[key]
        value = value * 1.5 * 41
      }

      formattedData[newKey] = {$eq: value}
    }

    try {
      const db = client.db('panel')
      const data = await db.collection('requests').findOne(formattedData)
      const exist = data === null ? false : true

      client.close()
      res.status(200).send({message: 'successful', exist})
    } catch (error) {
      client.close()
      res.status(400).send({message: 'Could not find the mobile number'})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
