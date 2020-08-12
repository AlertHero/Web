
const alerts = [
  {
    id: 1,
    message: 'Harry Potter and the Chamber of Secrets',
    severity: 'LOW',
    isActive: false,
  },
  {
    id: 2,
    message: 'Jurassic Park',
    severity: 'LOW',
    isActive: false,
  },
];

const resolvers = {
  Query: {
    alerts: () => {
      return {
        alerts,
        cursor: 'test',
        hasMore: false,
      };
    },
  },
};

module.exports = resolvers;