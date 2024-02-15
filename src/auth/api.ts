import type { APIRoute } from "astro";

import { lucia } from ".";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { userTable, sessionTable } from './models';

import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const schema = { user: userTable, session: sessionTable };

export const signUp: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();

    const username = formData.get("username");
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-zA-Z0-9_]+$/.test(username)
    ) {
        return new Response("Invalid username", { status: 400 });
    }

    const password = formData.get("password");
    if (
        typeof password !== "string" ||
        password.length < 6 ||
        password.length > 255
    ) {
        return new Response("Invalid password", { status: 400 });
    }

    const userId = generateId(16);
    const hashedPassword = await new Argon2id().hash(password);

    const sqliteDB = sqlite('auth.db')
    const db = drizzle(sqliteDB, { schema })

    // TODO: Check if username is already taken
    await db.insert(schema.user).values({
        id: userId,
        username,
        hashedPassword,
    })

    const session = await lucia.createSession(userId, {});
    const {name, value, attributes} = lucia.createSessionCookie(session.id);

    ctx.cookies.set(name, value, attributes);

    return ctx.redirect("/");
}