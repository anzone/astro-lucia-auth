import type {Config} from 'drizzle-kit'

export default {
    schema: './src/**/models.ts',
    out: './migrations',
    driver: 'better-sqlite',
    dbCredentials: {
        url: 'auth.db'
    }
} satisfies Config;