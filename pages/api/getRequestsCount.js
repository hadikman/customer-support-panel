import connect from 'database'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await connect()

    try {
      const db = client.db('panel')
      let data = await db.collection('requests').countDocuments({seen: true})

      data = JSON.stringify({data})

      client.close()
      res.status(200).send(data)
    } catch (error) {
      client.close()
      res.status(400).send({message: 'Could not read the requests count'})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
