import http from 'http'
import router from "@/router";
import useRethink from "./composables/use-rethink.ts";
import {Server as SocketServer} from "socket.io";

const {change} = useRethink()

const requestListener: http.RequestListener = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    if(req.method === 'OPTIONS') {
        res.end()
    } else {
        router.lookup(req, res)
    }
}

if (import.meta.env.PROD) {
    const host = import.meta.env.VITE_APP_HOST || '127.0.0.1'
    const port = import.meta.env.VITE_APP_PORT || '5000'
    const server = http.createServer(requestListener)

    const io = new SocketServer(server, {
        cors: {
            origin: import.meta.env.VITE_CROSS_ORIGIN,
        }
    })

    change(io, 'users','users.changefeeds')

    server.listen(port, () => {
        console.log(`🚀 Server ready at ${host}:${port}`)
    })

    io.sockets.on('connection', (socket) => {
        console.log(`A new User connected : ${socket.id}`)

        io.emit("emit.onserver", 'Hi client, what you up to ?')
        console.log(`Message to client : ${socket.id}`)
        socket.on("emit:onclient", message => {
            console.log(`Message from client, ${socket.id}: ${message}`)
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected : ${socket.id}`)
        })
    })
}
export const viteNodeApp = requestListener
