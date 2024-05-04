import useMongo from "../../composables/use-mongo.ts";
import createError from "../../utils/create-error.ts";
import ctxHandler from "../../utils/ctx-handler.ts";

export default ctxHandler(async ctx => {
    const {connect, close, ObjectId} = useMongo()

    const id: string = ctx.params.id

    const  {client, db} = await connect()

    const collectionUsers = db.collection('users')

    const _id = new ObjectId(id)

    const doc = await collectionUsers.findOne({
        _id
    })

    close(client)


    if(!doc) {
        createError({
            statusCode: 404,
            message: `User with id ${ctx.params.id} does not exist`
        })
    }

    return doc
})
