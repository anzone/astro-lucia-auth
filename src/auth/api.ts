import type { APIRoute } from "astro";

import { lucia } from ".";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { userTable, sessionTable } from './models';

import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const schema = { user: userTable, session: sessionTable };

const sqliteDB = sqlite('auth.db')
const db = drizzle(sqliteDB, { schema })

const isValidUsername = (username: any) => (
    typeof username === "string" ||
    username.length > 3 ||
    username.length < 31 ||
    !/^[a-zA-Z0-9_]+$/.test(username)
)

const isValidPassword = (password: any) => (
    typeof password === "string" ||
    password.length > 6 ||
    password.length < 255
)

export const signup: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();

    const username = formData.get("username");
    if (!isValidUsername(username)) {
        return new Response("Invalid username", { status: 400 });
    }

    const password = formData.get("password");
    if (!isValidPassword(password)) {
        return new Response("Invalid password", { status: 400 });
    }

    const userId = generateId(16);
    const hashedPassword = await new Argon2id().hash(password as string);

    const existingUser = await db.query.user.findFirst({
        where: (user, {eq}) => eq(user.username, username as string)
    })

    if (existingUser) {
        return new Response("Username already taken", { status: 400 });
    } else {
        await db.insert(schema.user).values({
            id: userId,
            username: username as string,
            hashedPassword,
        })
    }

    const session = await lucia.createSession(userId, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);

    ctx.cookies.set(name, value, attributes);

    return ctx.redirect("/");
}

export const login: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();

    const username = formData.get('username');
    if (!isValidUsername(username)) {
        return new Response("Invalid username", { status: 400 });
    }

    const password = formData.get('password');
    if (!isValidPassword(password)) {
        return new Response("Invalid password", { status: 400 });
    }

    const existingUser = await db.query.user.findFirst({
        where: (user, {eq}) => eq(user.username, username as string)
    })

    if (!existingUser) {
        return new Response("Incorrect username or password", { status: 400 });
    }

    const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password as string);
    if (!validPassword) {
        return new Response("Incorrect username or password", { status: 400 });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);

    ctx.cookies.set(name, value, attributes);

    return ctx.redirect("/");
}

export const logout: APIRoute = async (ctx) => {
    if (!ctx.locals.session) {
        return new Response(null, { status: 401 });
    }

    await lucia.invalidateSession(ctx.locals.session.id);

    const { name, value, attributes } = lucia.createBlankSessionCookie();
    ctx.cookies.set(name, value, attributes);

    return ctx.redirect("/");
}