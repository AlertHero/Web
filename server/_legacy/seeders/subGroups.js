const groupsArr = [
  { name: 'Admins' },
  { name: 'Doctors' },
  { name: 'Nurses' },
  { name: 'Residents' },
  { name: 'Attendings' },
  { name: 'Non-Medical Staff' },
];

module.exports = async (models) => {
  await models.Group.bulkCreate(groupsArr)
    .then(() => {

    }).catch((err) => {
      console.log('Groups Error:', err);
    });
};
