import {MongoClient, ObjectId} from "mongodb";

const url = import.meta.env.VITE_DB_HOST
const dbName = import.meta.env.VITE_DB_DBNAME

async function connect() {
    const client = new MongoClient(url)

    await client.connect()
    console.log("🚀 Connected successfully to MongoDB server")

    const db = client.db(dbName)
    return {
        db, client
    }
}

function  close(client) {
    client.close()
    console.log("🚀 Disconnected from MongoDB server")
}

export default () => {
    return {
        ObjectId,
        connect,
        close
    }
}
