import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");

  const token = jwt.sign({ userId }, 
    process.env.JWT_SECRET,
     { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined
  });

  return token;
};

export const clearToken = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });
};
