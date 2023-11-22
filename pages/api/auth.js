export default async function handler(req, res) {
  if (req.method === 'POST') {
    let {username, password} = req.body

    const isValidUsername = username === 'admin'
    const isValidPassword = password === '5555'

    if (isValidUsername && isValidPassword) {
      res.status(200).send({success: true, data: 'ghsl3902jds'})
    } else {
      res.status(401).send({success: false, data: ''})
    }
  } else {
    res.status(400).send({message: 'Bad request!'})
  }
}
