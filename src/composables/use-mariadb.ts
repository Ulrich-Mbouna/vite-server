import mariadb from 'mariadb';

const pool = mariadb.createPool({
    connectionLimit: 10,
    host: import.meta.env.VITE_DB_HOST,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
    database: import.meta.env.VITE_DB_DBNAME
})

export default async () => {
    let connection;

    try {
        connection = await pool.getConnection()
        console.log("Connection Successfully")
    } catch (err) {
        console.error("Connection failed")
        throw err
    }

    return {
        pool: connection
    }
}
