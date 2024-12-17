export const validateDesign = (connections) => {
  const visited = new Set();
  const dfs = (nodeId) => {
    visited.add(nodeId);
    const connectedNodes = connections
      .filter((conn) => conn.from.id === nodeId || conn.to.id === nodeId)
      .map((conn) => (conn.from.id === nodeId ? conn.to.id : conn.from.id));

    for (const neighbor of connectedNodes) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  };

  if (connections.length > 0) {
    dfs(connections[0].from.id);
    const allUsedNodes = new Set(
      connections.flatMap((conn) => [conn.from.id, conn.to.id])
    );
    if (visited.size !== allUsedNodes.size) {
      return false;
    }
  }

  const connectionCounts = {};
  connections.forEach((conn) => {
    connectionCounts[conn.from.id] = (connectionCounts[conn.from.id] || 0) + 1;
    connectionCounts[conn.to.id] = (connectionCounts[conn.to.id] || 0) + 1;
  });

  const invalidNodes = Object.entries(connectionCounts).filter(
    ([_, count]) => count < 2
  );
  return invalidNodes.length === 0;
};
