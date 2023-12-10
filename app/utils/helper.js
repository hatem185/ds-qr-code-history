function calcNumberOfPages(qty, codesPerPage) {
  const numberOfPages = qty % codesPerPage;
  return numberOfPages === 0
    ? numberOfPages
    : Math.floor(qty / codesPerPage) + 1;
}

export { calcNumberOfPages };
