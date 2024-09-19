import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.set('view engine', 'ejs')
//
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.render('index')
})
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, {
      expiresIn: '1h'
    })
    res
      .cookie('access_token', token, {
        httpOnly: true, // la cookie solo es acesible ne le servidor
        secure: process.env.NODE_ENV === 'production', // solo en httpps
        sameSite: 'strict',
        maxAge: 3600000 // 1 hora
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message) // no mandar el error desde le repositorio
  }
})

app.post('/logout', (req, res) => { })

app.get('/protected', (req, res) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(403).send('Access denied')
  }
  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY)
    // res.send({ message: 'Hello, ' + decoded.username })
    res.render('protected', decoded)
  } catch (error) {
    res.status(401).send('Invalid token')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
