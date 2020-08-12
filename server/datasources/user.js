const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');
const bcrypt = require('bcrypt');
const { createTokens } = require('../utils/auth');
const { formatErrors } = require('../utils');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  // Login with email & password args
  async tryLogin({ email: emailArg, password }) {
    // get email from arguemnt or from context if there
    const email = this.context && this.context.user ? this.context.user.email : emailArg;
    const user = await this.store.User.findOne({ where: { email }, raw: true });
    if (!user) {
      return {
        code: '',
        success: false,
        message: 'Email address not found',
        user: {}
      };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        code: '',
        success: false,
        message: 'Password is incorrect',
      };
    }

    const refreshTokenSecret = user.password + this.context.SECRET2;
    const [token, refreshToken] = await createTokens(user, this.context.SECRET, refreshTokenSecret);
    user.token = token;
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    return {
      code: '',
      success: true,
      message: 'Logged In',
      user,
    };
  }

  async findUser({ id: userId }) {
    if (userId) {
      const user = await this.store.User.findOne({ where: { id: userId } });
      return user;
    } 

    if (!this.context) return null;

    const email = this.context.user.email;
    if (!email || !isEmail.validate(email)) return null;

    const user = await this.store.User.findOne({ where: { email } });
    return user;
  }

  async update(args) {
    // Look for user, return null if not found
    const user = await this.store.User.findOne({ where: { id: args.id } });
    if (!user) return {
      code: '',
      success: false,
      message: 'User not found',
      errors: [],
      user: null,
    };

    // Incorporate password in update args & UPDATE
    let newargs = {...args, password: user.password};
    return this.store.User.update(newargs, { where: { id: args.id }, returning: true})
      .then(res => {
        return {
          code: '',
          success: true,
          message: 'User has been updated',
          errors: [],
          user: res[1][0].dataValues,
        };
      })
      .catch(err => {
        return {
          code: '',
          success: false,
          message: 'User update failed',
          errors: err,
          user: null,
        };
      })
  }

  async createMultiple(args) {
    const { groups } = args;
    return this.store.User.bulkCreate(args)
      .then(res => {
        res.map(user => {
          groups.map(groupId => {
            this.store.Member.create({
              userId: user.dataValues.id,
              role: user.dataValues.role,
              groupId,
            });
          });
        });
        console.log(res)
        return {
          code: '',
          success: true,
          message: 'Users created',
          errors: [],
        };
      })
      .catch(err => {
        return {
          code: '',
          success: false,
          message: 'Users creation failed',
          errors: err,
        };
      })
  }
}

module.exports = UserAPI;