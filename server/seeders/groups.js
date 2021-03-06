const groupsArr = [
  { name: 'Admins' },
  { name: 'Doctors' },
  { name: 'Nurses' },
  { name: 'Non-Medical Staff' },
  { name: 'Residents' },
  { name: 'Attendings' },
];

module.exports = async (models) => {
  await models.Group.bulkCreate(groupsArr)
    .catch((err) => {
      console.log('Groups Error:', err);
    });
};
