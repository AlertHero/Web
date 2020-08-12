const groupsArr = [
  { name: 'Admins' },
  { name: 'Doctors' },
  { name: 'Nurses' },
  { name: 'Non-Medical Staff' },
];

const subgroupsArr = [
  { name: 'Residents', groupId: 2 },
  { name: 'Attendings', groupId: 2 },
];

module.exports = async (models) => {
  await models.Group.bulkCreate(groupsArr)
    .then(() => {
      models.SubGroup.bulkCreate(subgroupsArr);
    }).catch((err) => {
      console.log('Groups Error:', err);
    });
};
