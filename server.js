require('dotenv').config()

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3000

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to database..."))

// --- MIDDLEWARE ORDER (KLUCZOWE!) ---

// 1. Parsowanie JSON i formularzy
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 2. Statyczne pliki — MUSZĄ BYĆ PRZED AUTH
app.use(express.static('public'))

// 3. Sesje
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}))

// 4. Logowanie — dostępne bez autoryzacji
app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (username === 'Marcin' && password === '1986') {
        req.session.loggedin = true
        req.session.username = username
        return res.redirect('/app.html')
    }

    res.send('Incorrect Username and/or Password!')
})

// 5. Strona główna — przekierowanie zależnie od sesji
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        return res.redirect('/app.html')
    }
    res.redirect('/login.html')
})

// 6. Middleware autoryzacji — dopiero TERAZ
const checkAuth = (req, res, next) => {
    if (req.session.loggedin) return next()
    res.redirect('/login.html')
}

// 7. Routy chronione
const kwRouter = require('./routes/kw')
app.use('/kw', checkAuth, kwRouter)

// 8. Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

// --- SERVER ---
app.listen(PORT, () => console.log('Server is running on port ' + PORT))
