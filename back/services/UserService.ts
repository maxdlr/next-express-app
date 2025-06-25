import { User, UserModel } from "../db-config/schema";

const findOneById = async (id: string) => {
  const user = UserModel.findById(id).exec();
  if (!user) return false;
  return user;
};

const findOneByEmail = async (email: string) => {
  const user = UserModel.findOne({ email });
  if (!user) return false;
  return user;
};

export const UserService = {
  findOneById,
  findOneByEmail,
};
