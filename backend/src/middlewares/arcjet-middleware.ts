import { aj } from "@/lib/arcjet";
import { AppError } from "@/utils/app-error";
import { isSpoofedBot } from "@arcjet/inspect";
import { NextFunction, Request, Response } from "express";

export const arcjetProtection = async (
  request: any,
  response: Response,
  next: NextFunction
) => {
  try {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return response
          .status(429)
          .send("Rate limit excedded. Please try again later.");
      } else if (decision.reason.isBot()) {
        return response.status(403).json({ message: "Bot access denied" });
      } else {
        return response
          .status(403)
          .json({ message: "Access denied by security policy" });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return response.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};
