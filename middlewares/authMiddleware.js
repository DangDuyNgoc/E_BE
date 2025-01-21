import jwt from "jsonwebtoken";

export const signAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

export const signRefreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};
