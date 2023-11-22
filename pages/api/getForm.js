import connect from 'database'
import {ObjectId} from 'mongodb'

const aliasNameForClient = {
  bis: 'mobileNumber',
  bas: 'phoneNumber',
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {body} = req
    const client = await connect()
    const id = new ObjectId(body.requestId)

    try {
      const db = client.db('panel')
      let data = await db.collection('requests').findOne({_id: id})
      const position = await db
        .collection('requests')
        .countDocuments({_id: {$lt: id}})

      const documentPosition = {position: position + 1}

      let formattedData = {}

      for (const key in data) {
        let value = data[key]
        let newKey = key

        if (aliasNameForClient[key]) {
          newKey = aliasNameForClient[key]
          value = value / 1.5 / 41
        }

        formattedData[newKey] = value
      }

      data = JSON.stringify({...documentPosition, ...formattedData})

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
