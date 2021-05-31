const emptyString = (message) => {
  return (value) => (value.length === 0 ? message : true);
};

module.exports = {
  emptyString,
};
