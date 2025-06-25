import jwt from "jsonwebtoken";
import { LoginRequestInterface } from "../interfaces/LoginRequestInterface";
import { UserService } from "./UserService";
import { User, UserModel } from "../db-config/schema";
import { RegisterRequestInterface } from "../interfaces/RegisterRequestInterface";

const JWT_SECRET = "gedeonSecret";

export class AuthService {
  public static register = async (
    registerRequest: RegisterRequestInterface,
  ) => {
    const { email, password, username } = registerRequest;

    if (!email || !password || !username) {
      throw {
        statusCode: 400,
        message: "Email, password and username are required.",
      };
    }

    if (await UserModel.exists({ email })) {
      throw {
        statusCode: 409,
        message: "User already exists with email: " + email,
      };
    }

    return await UserModel.create(registerRequest);
  };

  public static authenticate = async (
    loginRequest: LoginRequestInterface,
  ): Promise<{ token: string; user: any }> => {
    const { email, password } = loginRequest;

    if (!email || !password) {
      throw { statusCode: 400, message: "Email and password are required." };
    }

    const user = await AuthService.getUser(email);
    if (!user) {
      throw { statusCode: 401, message: "Invalid credentials." };
    }

    const isMatch = await AuthService.challengePassword(user, password);
    if (!isMatch) {
      throw { statusCode: 401, message: "Invalid credentials." };
    }

    const token = AuthService.generateToken(user);

    return {
      token,
      user: user,
    };
  };

  private static async getUser(email: string) {
    const user = await UserService.findOneByEmail(email);
    return user;
  }

  private static async challengePassword(
    user: any,
    plainPassword: string,
  ): Promise<boolean> {
    const isMatch = await user?.comparePassword(plainPassword);
    return isMatch;
  }

  private static generateToken(user: any): string {
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    return token;
  }
}
