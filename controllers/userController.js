const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameExists = await User.findOne({ username });
        
        if (usernameExists) {return res.json({msg: "Username already taken", status: false})};
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.json({msg: "Email already in use", status: false});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        console.log(`${user.username} successfully registered`);
        delete user.password;
        return res.json({status: true, user});
    } catch (exception) {
        // Next is used to call the next function to call
        next(exception);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.json({msg: "Incorrect password or username", status: false});
        
        const isPasswordSame = await bcrypt.compare(password, user.password);
        if (!isPasswordSame) return res.json({msg: "Incorrect password or username", status: false});

        console.log(`${username} logged in`);
        delete user.password;
        return res.json({status: true, user});
    } catch (exception) {
        // Next is used to call the next function to call
        next(exception);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        }, {new: true});
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (exception) {
        next(exception);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        // Get all user ids in db except current user (req.params.id)
        // Can be done with $ne: <id>
        const users = await User.find({_id: {$ne: req.params.id }}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (exception) {
        next(exception);
    }
}