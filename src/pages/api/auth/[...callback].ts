import type { APIRoute } from "astro";
import { login, signup, logout } from "../../../auth/api";

export const POST: APIRoute = async (ctx) => {
    const callback = ctx.params.callback;

    const callbacks = {
        login,
        signup, 
        logout
    }

    if (Object.keys(callbacks).includes(callback ?? '')) {
        return await callbacks[callback as keyof typeof callbacks](ctx);
    }

    return ctx.redirect("/", 308);
};

export const GET: APIRoute = async (ctx) => {
    return ctx.redirect("/", 308);
};

export const PUT: APIRoute = async (ctx) => {
    return ctx.redirect("/", 308);
};

export const DELETE: APIRoute = async (ctx) => {
    return ctx.redirect("/", 308);
};

export const PATCH: APIRoute = async (ctx) => {
    return ctx.redirect("/", 308);
};
