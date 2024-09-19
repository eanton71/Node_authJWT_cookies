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
app.use((req, res, next) => {
  const token = req.cookies.access_token
  let data = null
  req.session = { user: null }
  try {
    data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch (error) {
    // req.session.user = null
    console.log(error.message)
  }
  next()
})
app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
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
  const { user } = req.session
  if (!user) return res.status(403).send('Access not authorized')
  res.render('protected', user)
})

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .send({ message: 'Logged out successfully' })
})

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
