## Crear proyecto
- mkdir nombre-proyecto
- cd nombre-proyecto
- Inicializar proyecto: `pnpm init` -> se crea package.json
- Crear `index.js`
- Instalar framework pra web: `pnpm install express`, alternativas: hono.dev, next.js
### Correccion de errores
- Formateador y corrector de errores: `pnpm install standard -D`, -D: dependencia de desarrollo
- Extension de VSCode: Eslint
- En package.json:
````json
"eslintConfig":{
  "extends":"standard"
}
````
### ES6, import en vez de require (CommonJS)
- En package.json:
````json
"type": "module" , 
````
### Codificar servidor Express y endpoints
- Servidor express y en medio las rutas `endpoints`. 
````js
import express, { request, response } from 'express'
import {PORT} from './config.js'

const app = express() 

app.get('/', (req , res ) => {
    res.send('<h1>Hello, World!</h1>')
})
app.post('/login', (req, res) => {})
app.post('/register', (req, res) => { })
app.post('/logout', (req, res) => { })
app.post('/protected', (req, res) => { })

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
````
- Importamos la variable PORT de un archivo config.js
````js
export const {
  PORT = 3000
} = process.env
````
### db local
- Crear un archivo user-repository.js
- Opcional: instalar zod.dev para vadlidaciones
### Valiodar cada error , que no salga informacion descontrolada
https://www.youtube.com/watch?v=OhE-mEt37iA&t=335s
### Encriptar los password de los usuarios
- Usar bcrypt de NodeJS
- Encriptar en repositorio de datos
### Usar HTTPS si quieres seguridad
- 
- Instalar ssl-certificates

### Vistas EJS

### Sesion e usuario
Express-session https://www.npmjs.com/package/express-session
Redis
JWT y Cookies HTTPOnly
 

### TODO
RefreshToken


