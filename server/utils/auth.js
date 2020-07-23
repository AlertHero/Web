const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authy = require('authy')(process.env.AUTHY_API_KEY);

// const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'email']),
    },
    secret,
    {
      expiresIn: '8h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );
  return [createToken, createRefreshToken];
};

exports.refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
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
  const refreshSecret = user.password + SECRET2;
  try {
    jwt.verify(refreshToken, user.refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await this.createTokens(user, SECRET, user.refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

exports.tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'Wrong Email' }],
    };
  }

  const valid = await bcrypt.compareSync(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Wrong password' }],
    };
  }

  const refreshTokenSecret = user.password + SECRET2;
  const [token, refreshToken] = await this.createTokens(user, SECRET, refreshTokenSecret);

  return {
    ok: true,
    token,
    refreshToken,
  };
};

exports.sendAuthyToken = async (phone, models) => {
  let user = await models.User.findOne({ where: { phone } });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'phone', message: 'You are not registered' }],
    };
  }
  if (!user.authyId) {
    // Register this user if it's a new mobile user
    await authy.register_user(user.email, user.phone, (err, response) => {
      if (err || !response.user) {
        console.log(err);
        const register = {
          ok: false,
          errors: [{ path: 'phone', message: 'There was error sending the code' }],
        };
      }
      user.authyId = response.user.id;
      user.save().then((doc) => {
        user = doc;
        sendToken();
      }).catch((err2) => {
        console.log(err2);
        const register = {
          ok: false,
          errors: [{ path: 'phone', message: 'There was error saving the user' }],
        };
      });
    });
    return {
      ok: true,
      id: user.id,
    };
  }
  // Otherwise send token to a known user
  sendToken();
  return {
    ok: true,
    id: user.id,
  };

  // With a valid Authy ID, send the 2FA token for this user
  function sendToken() {
    authy.request_sms(user.authyId, true, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('sent');
      }
    });
  }
};

exports.verifyAuthyToken = async (otp, id, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { id }, raw: true });

  const verify = await authy.verify(user.authyId, otp, (err) => {
    if (err) {
      console.log(err);
    }
  });
  const refreshTokenSecret = user.password + SECRET2;
  const [token, refreshToken] = await this.createTokens(user, SECRET, refreshTokenSecret);
  return {
    ok: true,
    token,
    refreshToken,
  };
};

