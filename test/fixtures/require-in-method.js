module.exports = {
  create: function () {
    return {
      bar: function () {
        return require('./bar').bar();
      }
    };
  }
};
