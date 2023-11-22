const {MongoClient, ServerApiVersion} = require('mongodb')

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cgpugjo.mongodb.net/?retryWrites=true&w=majority`
// const localConnectionString = 'mongodb://0.0.0.0:27017/'

export default async function connect() {
  return await MongoClient.connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
}
