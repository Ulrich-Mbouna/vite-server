import findmyway from 'find-my-way'
import * as fs from "fs";
import index from "@/routes/index"
import users from '@/routes/users'
import userCreate from '@/routes/users/create'
import userById from '@/routes/users/id'

const router = findmyway()

router.on('GET', '/', async (req, res) => {
    const context = {
        req,
        message: 'Hello World'
    }

    const { data, statusCode} = await index(context)
    res.statusCode = statusCode
    res.end(data)
})

router.on('GET', '/:test', (_req, res,params) => {
    res.end(JSON.stringify(params))
})

router.on('GET', '/hello', (_req, res, _params) => {
    const {message} = useHello()
    console.log(`message from composables = ${message}`)
    console.log(`message from utils = ${hello()}`)
    res.end('{"winter" : "is here"}')
})

router.on('GET', '*', (_req, res) => {
    res.statusCode = 404
    res.end('{"message" : "Page not found"}')
})

router.on('GET', '/public/*', (req, res) => {
    fs.readFile(`./${decodeURIComponent(req.url)}`, (err, data) => {
        if(err) {
            res.statusCode = 404
            res.end(JSON.stringify({
                message: 'File not Found or you made an invalid request.',
                data: err
            }))
            return
        }
        res.setHeader('Content-Type', 'text/plain')
        res.end(data)
    })
})

router.on('GET', '/users', async (req, res) => {
    const ctx = {req}
    const { data, statusCode } = await  users(ctx)

    res.statusCode = statusCode
    res.end(data)
})

router.on('POST', '/users/create',async (req, res) => {
    const ctx = {req}
    const  { data, statusCode } = await userCreate(ctx)
    res.statusCode = statusCode
    res.end(data)
})
router.on('GET', '/users/:id', async (req, res, params) => {
    const ctx = {req, params}
    const { data, statusCode} = await userById(ctx)

    res.statusCode = statusCode
    res.end(data)
})
export default router
