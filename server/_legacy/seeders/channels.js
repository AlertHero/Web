const channelsArr = [
  { name: 'All', public: true },
  { name: 'Admins', groupId: 1 },
  { name: 'Doctors', groupId: 2 },
  { name: 'Nurses', groupId: 3 },
  { name: 'Residents', subgroupId: 1 },
  { name: 'Attendings', subgroupId: 2 },
  { name: 'Non-Medical Staff', groupId: 4 },
];

module.exports = async (models) => {
  await models.Channel.bulkCreate(channelsArr)
    .then((res) => {

    }).catch((err) => {
      console.log('Channels Error:', err);
    });
};
