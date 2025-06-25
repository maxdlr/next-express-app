import * as bcrypt from "bcrypt";

const encrypt = async (plainPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Failed to encrypt password");
  }
};

export const EncryptionService = {
  encrypt,
};
