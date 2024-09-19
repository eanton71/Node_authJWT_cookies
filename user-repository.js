import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import DBlocal from 'db-local'
import { SALT_ROUNDS } from './config.js'
const { Schema } = new DBlocal({ path: './db' })
const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})
export class UserRepository {
  static async create ({ username, password }) {
    Validation.username(username)
    Validation.password(password)
    // 3. aseguararse de que el usrname no existe  capturandoe l error o buscando el usuario
    const user = User.findOne({ username })
    if (user) throw new Error('username already exists')
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()
    console.log(id)
    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('username not found')
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password is invalid')
    const { password: _, ...publicUser } = user // desestrucurar objeto user
    return publicUser
  }
}

class Validation {
  static username (username) {
    // 1 validar username
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3')
  }

  static password (password) {
    // 2 validar password
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 8) throw new Error('password must be at least 8')
  }
}
