import jwt from "jsonwebtoken";



export const createToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role  }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const sendToken = (res, user) => {
  const token = createToken(user);
  res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
};
