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
