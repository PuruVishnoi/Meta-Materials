export const generateAllDesigns = (dots) => {
  const connections = [];
  const combinations = [];

  dots.forEach((dotA) => {
    dots.forEach((dotB) => {
      if (isAdjacent(dotA, dotB)) {
        connections.push({ from: dotA, to: dotB });
      }
    });
  });

  const totalConnections = connections.length;
  for (let i = 1; i < 1 << totalConnections; i++) {
    const subset = [];
    for (let j = 0; j < totalConnections; j++) {
      if (i & (1 << j)) subset.push(connections[j]);
    }
    combinations.push(subset);
  }

  return combinations;
};

const isAdjacent = (dotA, dotB) => {
  const rowDiff = Math.abs(dotA.row - dotB.row);
  const colDiff = Math.abs(dotA.col - dotB.col);
  return rowDiff <= 1 && colDiff <= 1 && rowDiff + colDiff > 0;
};
