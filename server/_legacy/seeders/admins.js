const adminsArr = [
  {
    firstName: 'Nate',
    lastName: 'Hawley',
    phone: '9177274540',
    title: 'Mr.',
    email: 'nate@dev.com',
    password: 'pass1',
    employed: true,
    workingNow: false,
    version: 1,
    role: 2,
  }, {
    firstName: 'Fausto',
    lastName: 'Brito',
    phone: '5555555555',
    title: 'Mr.',
    email: 'fausto@dev.com',
    password: 'pass1',
    employed: true,
    workingNow: false,
    version: 1,
    role: 2,
  },
];

module.exports = async (models) => {
  await models.User.bulkCreate(adminsArr).then((res) => {
    res.map((admin, i) => {
      models.Member.create({
        userId: (i += 1),
        role: admin.dataValues.role,
        groupId: 1,
      });
    });
  }).catch((err) => {
    console.log('Admins Error:', err);
  });
};
