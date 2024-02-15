import { lucia } from ".";
import { verifyRequestOrigin } from "lucia";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (ctx, next) => {
    if (ctx.request.method !== "GET") {
        const originHeader = ctx.request.headers.get("Origin");
        const hostHeader = ctx.request.headers.get("Host");

        if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
            return new Response(null, { status: 403 })
        }
    }

    const sessionId = ctx.cookies.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        ctx.locals.user = null;
        ctx.locals.session = null;
        return next();
    }

    const {session, user} = await lucia.validateSession(sessionId);

    if(session && session.fresh){
        const {name, value, attributes} = lucia.createSessionCookie(session.id);
        ctx.cookies.set(name, value, attributes);
    }

    if (!session) {
        const {name, value, attributes} = lucia.createBlankSessionCookie();
        ctx.cookies.set(name, value, attributes);
    }

    ctx.locals.session = session;
    ctx.locals.user = user;

    return next();
});