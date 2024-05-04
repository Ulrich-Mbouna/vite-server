import normalizeBody from "../../../utils/normalize-body.ts";
import createError from "../../../utils/create-error.ts";
import toSql from "../../../utils/to-sql.ts";
import useMariadb from "../../../composables/use-mariadb.ts";

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
