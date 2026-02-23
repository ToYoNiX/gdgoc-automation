import type { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).authenticated) return next();
  return res.redirect("/login");
}