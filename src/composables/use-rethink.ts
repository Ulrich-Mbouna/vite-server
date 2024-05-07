import {r} from "rethinkdb-ts"
import {Socket} from "socket.io";

const connect = async () => {

    const connection = await r.connect({
        host: import.meta.env.VITE_DB_HOST,
        port: import.meta.env.VITE_DB_PORT,
        db: import.meta.env.VITE_DB_DBNAME,
    })
    // rdb.dbCreate(import.meta.env.VITE_DB_DBNAME).run(connection, (err, results) => {
    //     console.log("Data Base Created successfully", {results, err})
    // })

    return connection
}

async function change(io: Socket, tableName: string, eventName: string) {
    try {
        const connection = await connect();
        const cursor = await  r.table(tableName)
            .changes()
            .run(connection)
        await cursor.each(function (err, row) {
            if (err) {
                throw err
            }

            console.log(JSON.stringify(row, null, 2))
            io.emit(eventName, row)
        })
    } catch (error) {
        console.error(error)
    }
}

export default () => {
    return {
        connect,
        change
    }
}
