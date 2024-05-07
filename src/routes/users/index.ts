import ctxHandler from "../../utils/ctx-handler.ts";
import useRethink from "../../composables/use-rethink.ts";
import {r} from 'rethinkdb-ts'
import createError from "../../utils/create-error.ts";

// For Maria Db
// export default ctxHandler(async () => {
//     const {pool} = await useMariadb()
//
//     const query = toSql(
//         `SELECT
//         'id',
//         'name',
//         'slug',
//         'created_on',
//         'updated_on'
//     FROM 'users'`);
//
//     const rows = await pool.query(query)
//
//     await pool.end()
//     return rows;
// })

// For Mongo
// export default ctxHandler(async () => {
//     const {connect,close} = useMongo()
//     const {client,db} = await connect()
//     const collectionUsers = db.collection('users')
//     const docs = await collectionUsers.find().toArray()
//     close(client)
//     return  docs
// })

// For RethinkDb
 export default ctxHandler(async () => {
     const {connect} = useRethink()
     const db = await connect();

     const exists = await r.tableList().contains('users').run(db)
     if(!exists) {
         createError({
             statusCode: 500,
             message : 'Users table not found from Ulrich',
         })
     }
     console.log({exists})
     const cursor = await r.table("users")
         .orderBy(r.desc('createdAt'))
         .run(db)
     const docs =  cursor
     await db.close()
     return docs
 })
