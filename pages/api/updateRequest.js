import connect from 'database'
import {ObjectId} from 'mongodb'

const aliasNameForDatabase = {
  mobileNumber: 'bis',
  phoneNumber: 'bas',
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let {body} = req
    const client = await connect()
    const id = new ObjectId(body.requestId)

    let formattedData = {}

    for (const key in body) {
      let value = body[key]
      let newKey = key

      if (key === 'requestId') continue

      if (aliasNameForDatabase[key]) {
        newKey = aliasNameForDatabase[key]
        value = value * 1.5 * 41
      }

      formattedData[newKey] = value
    }
    try {
      const db = client.db('panel')
      await db
        .collection('requests')
        .updateOne({_id: id}, {$set: formattedData})

      client.close()
      res.status(200).send({message: 'successful', data: body})
    } catch (error) {
      client.close()
      res.status(400).send({message: 'Could not update the form data'})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
