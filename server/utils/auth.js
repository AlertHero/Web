const _ = require('lodash');
const jwt = require('jsonwebtoken');

// Create token & refresh-token for user
exports.createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'email']),
    },
    secret,
    {
      expiresIn: '8h',
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    }
  );
  return [createToken, createRefreshToken];
};

// Refresh user's token with refresh-token
exports.refreshTokens = async ( refreshToken, models, secret ) => {
  let userId = 0;
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }
  if (!userId) {
    return {};
  }
  const user = await models.User.findOne({ where: { id: userId }, raw: true });
  if (!user) {
    return {};
  }
  // const refreshSecret = user.password + secret2;
  try {
    jwt.verify(refreshToken, user.refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await this.createTokens(
    user,
    secret,
    user.refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

exports.getUser = async (token, Rtoken, models) => {
    if (!token) return null;
    const { user } = await jwt.verify(token, process.env.SECRET);
    if (!user) {
      const newTokens = await this.refreshTokens(Rtoken, models, process.env.SECRET);
      if (newTokens.token && newTokens.refreshToken) {
        return newTokens.user;
      }
    }
    return user;
};