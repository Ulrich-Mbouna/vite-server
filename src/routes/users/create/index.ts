import normalizeBody from "../../../utils/normalize-body.ts";
import createError from "../../../utils/create-error.ts";
import ctxHandler from "../../../utils/ctx-handler.ts";
import useRethink from "../../../composables/use-rethink.ts";
import {r} from "rethinkdb-ts";

/*  Maria DB
export default ctxHandler(async ctx => {
    const {pool} = await useMariadb()
    const body = await normalizeBody(ctx.req)

    if(body.name === undefined) {
        createError({
            statusCode : 500,
            message: 'name is undefined'
        })
    }
    if(body.slug === undefined) {
        createError({
            statusCode : 500,
            message: 'slug is undefined'
        })
    }
    if(body.name === '') {
        createError({
            statusCode : 400,
            message: 'name is required'
        })
    }
    if(body.slug === '') {
        createError({
            statusCode : 400,
            message: 'slug is required'
        })
    }

    const timestamp = Date.now()

    const user = {
        id: crypto.randomUUID(),
        name: body.name,
        slug: body.slug,
        createdAt: timestamp,
        updatedAt: timestamp
    }

    const query = toSql(
        `INSERT INTO 'users' (
                     'id',
                     'name',
                     'slug',
                     'created_on',
                     'updated_on'
        ) VALUES (
            "${user.id}",
            "${user.name}",
            "${user.slug}",
            "${user.createdAt}",
            "${user.updatedAt}"
        )`
    )

    const result = await pool.query(query)
    await pool.end()

    return result
})
 */

// Rethinkd DB

export default ctxHandler(async ctx => {
    const {connect} = useRethink();
    const body = await normalizeBody(ctx.req);
    const db = await connect()
    const searchQuery = {
        slug: body.slug
    }
    const found = await r.table('users')
        .filter(searchQuery)
        .nth(0)
        .default(null)
        .run(db)
    if(found) {
        createError({
            statusCode: 400,
            message: `Slug ${body.slug} has been taken`
        })
    }

    const timestamp = Date.now()
    const options = {
        name: body.name,
        slug: body.slug,
        createdAt: timestamp,
    }
    const doc = await r.table("users").insert(options, {
        returnChanges:true
    })
        .run(db)

    await db.close()

    if(doc.inserted !== 1) {
        createError({
            statusCode: 500,
            message: "Add user failed"
        })
    }

    return doc
})
