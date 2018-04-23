// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/magicdb'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/testmagicdb'
  },
  
};
