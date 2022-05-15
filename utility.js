const mapValues = require("lodash/mapValues");

const getFilter = (filter, filtersOption) =>
  mapValues(filter, (value, key) => {
    if (filtersOption && filtersOption[key]) {
      return filtersOption[key](value);
    }
    return value;
  });
const parseQuery = (query, filtersOption) => {
  const { range, sort, filter } = query;

  const [from, to] = range ? JSON.parse(range) : [0, 100];

  const { q, ...filters } = JSON.parse(filter || "{}");

  return {
    offset: from,
    limit: to - from + 1,
    filter: getFilter(filters, filtersOption),
    order: [sort ? JSON.parse(sort) : ["id", "ASC"]],
    q,
  };
};
module.exports = { getFilter, parseQuery };
