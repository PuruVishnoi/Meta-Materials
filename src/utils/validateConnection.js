export const validateConnection = (
  newConnection,
  connections,
  selectedDots,
  setError
) => {
  for (const conn of connections) {
    if (
      linesIntersect(newConnection.from, newConnection.to, conn.from, conn.to)
    ) {
      setError("New line intersects with an existing line.");
      return false;
    }
  }

  if (selectedDots.length > 0) {
    const lastDot = selectedDots[selectedDots.length - 1];
    if (newConnection.from.id !== lastDot.id) {
      setError("Lines must be continuous.");
      return false;
    }
  }

  // if (!isAdjacent(newConnection.from, newConnection.to)) {
  //   setError("Dots must be directly adjacent.");
  //   return false;
  // }

  return true;
};

const isAdjacent = (dotA, dotB) => {
  const rowDiff = Math.abs(dotA.row - dotB.row);
  const colDiff = Math.abs(dotA.col - dotB.col);
  return rowDiff <= 1 && colDiff <= 1 && rowDiff + colDiff > 0;
};

const linesIntersect = (a, b, c, d) => {
  const ccw = (p1, p2, p3) =>
    (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);

  return (
    ccw(a, c, d) !== ccw(b, c, d) &&
    ccw(a, b, c) !== ccw(a, b, d) &&
    !(a.x === c.x && a.y === c.y) &&
    !(b.x === d.x && b.y === d.y) &&
    !(a.x === d.x && a.y === d.y) &&
    !(b.x === c.x && b.y === c.y)
  );
};
