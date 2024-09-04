import { MongoClient, Db } from "mongodb";

export default async function dbConnect() {
    const url = process.env.DB_URL;
    if (!url) throw new Error("DB 연결 실패");
    const database = process.env.DB_DATABASE;

    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(database);

    const close = async () => {
        await client.close();
    };

    return { db, close };
}
