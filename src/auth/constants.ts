export const jwtConstants = {
  secret: 'secretKey',
  expiresIn: 10000, //second = 30min
};

export const refreshSessionConstants = {
  userSessionCount: 5,
  expiresIn: 5184000000, //millisecond = 60d
};

export const bcryptConstants = {
  saltRounds: 10,
};
