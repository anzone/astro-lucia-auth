import { Lucia } from 'lucia'
import { dbAdapter } from './db-adapter'

export const lucia = new Lucia(
    dbAdapter,
    {
        sessionCookie: {
            attributes: {
                secure: import.meta.env.PROD,
            }
        },
        getUserAttributes: (attrs) => ({
            username: attrs.username,
        })
    }
)

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
}