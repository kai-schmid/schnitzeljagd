const UserDetails = require('./user');
const Data = require('./dataset');

UserDetails.register({ username: 'admin', active: false }, 'admin');
UserDetails.register({ username: 'root', active: false }, 'root');
