const codesArr = [
  { desc: 'Severe', color: '#f5222d', isActive: false },
  { desc: 'Elevated', color: '#ffec3d', isActive: false },
  { desc: 'Low', color: '#73d13d', isActive: true },
  { desc: 'Behavior', color: '#9254de', isActive: false },
];

module.exports = async (models) => {
  await models.Code.bulkCreate(codesArr)
    .then(() => {
      
    }).catch((err) => {
      console.log('Codes Error:', err);
    });
};
