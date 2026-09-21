export const getPagination = (query = {}, { defaultLimit = 10, maxLimit = 50 } = {}) => {
  const page = Math.max(1, parseInt(query?.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query?.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPage = (items, pagination) => {
  const hasMore = items.length > pagination.limit;
  const pageItems = hasMore ? items.slice(0, pagination.limit) : items;

  return {
    items: pageItems,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      hasMore,
    },
  };
};
