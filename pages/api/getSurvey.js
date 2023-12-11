import connect from 'database'

const aliasNameForClient = {
  bis: 'mobileNumber',
  bas: 'phoneNumber',
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await connect()

    try {
      const db = client.db('panel')
      let data = await db.collection('survey').find().sort({_id: -1}).toArray()

      data = data.map(d => {
        let formattedData = {}

        for (const key in d) {
          let value = d[key]
          let newKey = key

          if (aliasNameForClient[key]) {
            newKey = aliasNameForClient[key]
            value = value / 1.5 / 41
          }

          formattedData[newKey] = value
        }

        return formattedData
      })

      data = JSON.stringify(data)

      client.close()
      res.status(200).send(data)
    } catch (error) {
      client.close()
      res.status(400).send({message: 'Could not read the data'})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
