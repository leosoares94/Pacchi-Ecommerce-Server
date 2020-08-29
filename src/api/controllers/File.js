const Avatar = require('../models/Avatar');
const UserModel = require('../models/User');

const addAvatar = async (req, res) => {
    const file = req.file;

    const newAvatar = await Avatar.create({
        file_path: file.filename
    });

    let updatedValues = { avatar_id: newAvatar.id };

    const updated = await UserModel.update(updatedValues, {
        where: { id: req.id }
    });

    return res.json({ newAvatar, file, updated });
};

module.exports = { addAvatar };
