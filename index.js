import express from 'express'
import path from 'path'

const __dirname = path.resolve(path.dirname(''))
const port = process.env.PORT || 6969

express()
    .use(express.static('client'))
    .use('/client/', express.static(path.join(__dirname, 'client')))
    .get('*', (req, res) =>
        res.sendFile(path.join(__dirname, 'client', 'index.html'))
    )
    .listen(port, () => console.log(`bruh ${port}`))
