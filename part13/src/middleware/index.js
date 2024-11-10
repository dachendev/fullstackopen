const { Session } = require("../models");

const getToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7);
  }
  return null;
};

const sessionMiddleware = async (req, res, next) => {
  const sessionId = getToken(req);

  if (!sessionId) {
    return res.status(401).send({ error: "session id missing" });
  }

  const session = await Session.findByPk(sessionId);

  if (!session) {
    return res.status(401).send({ error: "session invalid" });
  }

  if (session.expiresAt < Date.now()) {
    await session.destroy();
    return res.status(401).send({ error: "session expired" });
  }

  const user = await session.getUser();

  if (user.isDisabled) {
    return res.status(401).send({ error: "user is disabled" });
  }

  req.sessionId = session.id;
  req.user = user;

  next();
};

module.exports = {
  sessionMiddleware,
};
