const bcrypt = require('bcryptjs')

const helpers = {};

helpers.hashpassword = async (password) => {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchpassword = async (password, dbpassword) => {
    try {
        return await bcrypt.compare(password, dbpassword);

    } catch (error) {
        console.log(error);
    }
};

module.exports = helpers;