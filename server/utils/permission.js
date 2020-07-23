const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
module.exports = { 
  requiresAuth: createResolver((parent, args, { user }) => {
    if (!user || !user.id) {
      throw new Error('Not authenticated');
    }
  }),
  requiresAdmin: createResolver((parent, args, { user }) => {
    if (!user || !user.id) {
      throw new Error('Not authenticated');
    }
  
    if (user.role <= 1) {
      throw new Error('Requires admin access');
    }
  }),
  requiresTeamAccess: createResolver(async (parent, { channelId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error('Not authenticated');
    }
    // check if channel exists
    const channel = await models.Channel.findOne({ where: { id: channelId } });
    if (!channel) {
      throw new Error('Channel not found');
    }
    // if user is not a member or an admin then throw error
    const client = await models.User.findOne({ where: { id: user.id } });
    const member = await models.Member.findOne({ where: { groupId: channel.groupId, userId: user.id } });
    if (!member) {
      if (client.role <= 1) {
        throw new Error("You have to be a member of the team to subcribe to it's messages");
      }
    }
  }),
};
