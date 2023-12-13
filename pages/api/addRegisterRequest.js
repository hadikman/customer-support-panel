import connect from 'database'

const aliasNameForDatabase = {
  mobileNumber: 'bis',
  phoneNumber: 'bas',
}
const extraProperties = {
  registerDate: new Date(),
  serviceState: 0,
  descOfServicesPerformed: '',
  dateOfService: '',
  seen: false,
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

      formattedData[newKey] = value
    }

    formattedData = {...formattedData, ...extraProperties}

    try {
      const db = client.db('panel')
      await db.collection('requests').insertOne(formattedData)

      client.close()
      res.status(200).send({message: 'successful', data: body})
    } catch (error) {
      client.close()
      res.status(400).send({message: 'Could not store the form data'})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
