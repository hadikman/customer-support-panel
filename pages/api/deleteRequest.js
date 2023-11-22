import connect from 'database'
import {ObjectId} from 'mongodb'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let {body} = req
    const client = await connect()
    const id = new ObjectId(body.requestId)

    try {
      const db = client.db('panel')
      await db.collection('requests').deleteOne({_id: id})

      client.close()
      res.status(200).send({message: 'successful'})
    } catch (error) {
      res.status(400).send({message: 'Could not delete the request'})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
