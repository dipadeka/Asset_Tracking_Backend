const bcrypt = require("bcrypt");
const EmrsUser = require("../models/emrsUser.model");
const { ADMIN_CREDENTIALS, SCHOOL_CREDENTIALS } = require("../data/emrsCredentialsSeed");

const toPublicUser = (doc) => {
  const user = doc.toObject ? doc.toObject() : doc;
  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    id: user.schoolId || user._id,
  };
};

const seedEmrsUsers = async () => {
  const count = await EmrsUser.countDocuments();
  if (count > 0) {
    console.log(`EMRS users already seeded (${count} records).`);
    return;
  }

  const allUsers = [ADMIN_CREDENTIALS, ...SCHOOL_CREDENTIALS];

  for (const entry of allUsers) {
    const hashPassword = await bcrypt.hash(entry.password, 10);
    await EmrsUser.create({
      ...entry,
      password: hashPassword,
    });
  }

  console.log(`Seeded ${allUsers.length} EMRS users into MongoDB.`);
};

module.exports = { seedEmrsUsers, toPublicUser };
