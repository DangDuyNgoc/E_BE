import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.log(error);
  }
};

export const matchPassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
