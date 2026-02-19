const getPagination = (page, limit) => {
  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 10;
  
  // skip = how many items to bypass
  // take = how many items to show
  const skip = (p - 1) * l;
  const take = l;

  return { skip, take, p, l };
};

module.exports = getPagination;