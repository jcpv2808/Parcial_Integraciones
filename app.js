const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./public/js/config.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/login.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/pages/register.html')
})

app.post('/crearCuenta', (req, res) => {
    console.log(typeof req.body.correo)

    if( req.body.correo === '' && req.body.password === ''){
        console.log("debe ingresar datos")
        res.sendFile(__dirname + '/public/pages/register.html')
    }else if (`${req.body.correo}` === 'correo@gmail.com' && `${req.body.password}` === '123') {
        const usuario = {
            correo: `${req.body.correo}`,
            contraseña: `${req.body.password}`
        }

        jwt.sign({ usuario: usuario }, config.secret, { expiresIn: '3600s' }, (err, token) => {
            console.log({ token: token })
        })

        res.sendFile(__dirname + '/public/pages/login.html')
    } else {
        return res.status(403).json(()=>{
            console.log('Error')
        })
    }
})

app.post('/login', verificarToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err) {
            res.sendStatus(403)
            res.sendFile(__dirname + '/public/pages/403.html')
        } else {
            res.sendFile(__dirname + '/public/pages/index.html')
            console.log(authData)
        }
    })
})

app.get('/dashboard', verificarToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err) {
            res.sendStatus(403)
            res.sendFile(__dirname + '/public/pages/403.html')
        } else {
            res.sendFile(__dirname + '/public/pages/index.html')
            console.log(authData)
        }
    })
})

app.get('/graficos', verificarToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err) {
            res.sendStatus(403)
            res.sendFile(__dirname + '/public/pages/403.html')
        } else {
            res.sendFile(__dirname + '/public/pages/graficos.html')
            console.log(authData)
        }
    })
})

app.get('/clientes', verificarToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err) {
            res.sendStatus(403)
            res.sendFile(__dirname + '/public/pages/403.html')
        } else {
            res.sendFile(__dirname + '/public/pages/clientes.html')
            console.log(authData)
        }
    })
})

function verificarToken(req, res, next) {
    const bearerheader = req.headers['authorization']

    if (typeof bearerheader !== 'undefined') {
        bearerToken = bearerheader.split(" ")[1]
        req.token = bearerToken
        next()
    } else {
        res.status(401)
        res.sendFile(__dirname + '/public/pages/401.html')
        next()
    }
}

app.use(express.static('public'))

app.listen(config.port, () => {
    console.log(`escuchando en el puerto: ${config.port} - http://localhost:${config.port}`)
})
