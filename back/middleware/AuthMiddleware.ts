import jwt from "jsonwebtoken";
import { UserModel } from "../db-config/schema";
import { ApiResponse } from "../interfaces/ApiResponse";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const JWT_SECRET = "gedeonSecret";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const tokenMissingRes = new ApiResponse().asAuthenticationFailure(
      "Token missing or broken",
    );
    return res.status(tokenMissingRes.statusCode).json(tokenMissingRes);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const tokenExpiredRes = new ApiResponse().asAuthenticationFailure(
          "Token missing or broken",
        );
        return res.status(tokenExpiredRes.statusCode).send(tokenExpiredRes);
      }
      if (err.name === "JsonWebTokenError") {
        const tokenBrokenRes = new ApiResponse().asAuthenticationTokenFailure(
          "Token missing or broken",
        );
        return res.status(tokenBrokenRes.statusCode).send(tokenBrokenRes);
      }
      const serverFailRes = new ApiResponse().asServerFailure(
        "Failed to authenticate token - " + err.message,
      );
      return res.status(serverFailRes.statusCode).send(serverFailRes);
    }

    try {
      const decodedPayload = decoded as { id: string; email: string };
      const user = await UserModel.findById(decodedPayload.id).select(
        "-password",
      );
      if (!user) {
        const userNotFoundRes = new ApiResponse().asNotFound(
          "User token not found",
        );
        return res.status(userNotFoundRes.statusCode).send(userNotFoundRes);
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
      };

      next();
    } catch (dbError) {
      const serverDBFailRes = new ApiResponse().asServerFailure(
        "Internal server error during user search" + (dbError as Error).message,
      );
      return res.status(serverDBFailRes.statusCode).json(serverDBFailRes);
    }
  });
};
