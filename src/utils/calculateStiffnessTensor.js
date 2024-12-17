export const calculateStiffnessTensor = (dots, connections) => {
  const nodeCount = dots.length;
  const stiffnessMatrix = Array.from({ length: nodeCount }, () =>
    Array(nodeCount).fill(0)
  );

  const stiffnessConstant = 1;

  connections.forEach((connection) => {
    const { from, to } = connection;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx ** 2 + dy ** 2);

    const stiffnessContribution = stiffnessConstant / length;

    const fromIndex = dots.findIndex((dot) => dot.id === from.id);
    const toIndex = dots.findIndex((dot) => dot.id === to.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      stiffnessMatrix[fromIndex][toIndex] += stiffnessContribution;
      stiffnessMatrix[toIndex][fromIndex] += stiffnessContribution;

      stiffnessMatrix[fromIndex][fromIndex] += stiffnessContribution;
      stiffnessMatrix[toIndex][toIndex] += stiffnessContribution;
    }
  });

  return stiffnessMatrix;
};
