import type { Request, Response } from "express";
import { logger } from "../app.js";
import layout from "../views/layout.js";
import login from "../views/login.js";

export function getLogin(req: Request, res: Response) {
  if ((req.session as any).authenticated) return res.redirect("/records");
  return res.send(layout("Login", login()));
}

export async function postLogin(req: Request, res: Response) {
  const username: string = req.body.username?.trim();
  const password: string = req.body.password?.trim();

  if (
    username === process.env.APP_USERNAME &&
    password === process.env.APP_PASSWORD
  ) {
    (req.session as any).authenticated = true;
    logger.info("Successful login");
    return res.redirect("/records");
  }

  logger.warn("Failed login attempt");
  return res.send(layout("Login", login("Invalid username or password")));
}

export function postLogout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}