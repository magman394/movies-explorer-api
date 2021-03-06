const allowlist = ['https://diplom.nomoredomains.monster', 'http://diplom.nomoredomains.monster', 'http://localhost:3000'];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

module.exports = {
  corsOptionsDelegate,
};
