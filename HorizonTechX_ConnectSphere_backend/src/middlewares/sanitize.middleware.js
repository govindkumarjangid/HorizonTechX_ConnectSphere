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