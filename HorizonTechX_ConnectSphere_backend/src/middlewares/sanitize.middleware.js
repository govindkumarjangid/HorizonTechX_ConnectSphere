// Removes keys like $ne, $gt and dotted keys from req.body so a client
// cannot send { "email": { "$ne": null } } into a query.
// Only the body is cleaned: Express 5 parses req.query as plain strings already.
const clean = (value) => {
  if (Array.isArray(value)) {
    value.forEach(clean);
    return;
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.') || key === '__proto__') {
        delete value[key];
      } else {
        clean(value[key]);
      }
    }
  }
};

const sanitizeBody = (req, _res, next) => {
  if (req.body) clean(req.body);
  next();
};

export default sanitizeBody;