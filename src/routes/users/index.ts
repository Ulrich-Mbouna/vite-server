import useMariadb from "../../composables/use-mariadb.ts";
import ctxHandler from "../../utils/ctx-handler.ts";
import toSql from "../../utils/to-sql.ts";
import useMongo from "../../composables/use-mongo.ts";

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
export default ctxHandler(async () => {
    const {connect,close} = useMongo()
    const {client,db} = await connect()
    const collectionUsers = db.collection('users')
    const docs = await collectionUsers.find().toArray()
    close(client)
    return  docs
})
