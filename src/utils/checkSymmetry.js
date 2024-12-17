export const checkSymmetry = (connections, n) => {
  if (connections.length === 0) return "";

  // Helper function to check if two connections are mirrors along the horizontal axis
  const isHorizontalMirror = (conn1, conn2) => {
    return (
      conn1.from.row === n - 1 - conn2.to.row &&
      conn1.from.col === conn2.to.col &&
      conn1.to.row === n - 1 - conn2.from.row &&
      conn1.to.col === conn2.from.col
    );
  };

  // Helper function to check if two connections are mirrors along the vertical axis
  const isVerticalMirror = (conn1, conn2) => {
    return (
      conn1.from.row === conn2.to.row &&
      conn1.from.col === n - 1 - conn2.to.col &&
      conn1.to.row === conn2.from.row &&
      conn1.to.col === n - 1 - conn2.from.col
    );
  };

  // Remove duplicate connections (both A → B and B → A are treated as duplicates)
  const uniqueConnections = [];
  const seenConnections = new Set();

  for (let conn of connections) {
    const connectionKey = `${conn.from.row},${conn.from.col},${conn.to.row},${conn.to.col}`;
    const reverseConnectionKey = `${conn.to.row},${conn.to.col},${conn.from.row},${conn.from.col}`;

    // Check if the connection or its reverse has already been seen
    if (
      !seenConnections.has(connectionKey) &&
      !seenConnections.has(reverseConnectionKey)
    ) {
      uniqueConnections.push(conn);
      seenConnections.add(connectionKey);
    }
  }

  let horizontalSymmetric = true;
  let verticalSymmetric = true;

  for (let conn of uniqueConnections) {
    let foundHorizontalMirror = false;
    let foundVerticalMirror = false;

    for (let otherConn of uniqueConnections) {
      if (isHorizontalMirror(conn, otherConn)) {
        foundHorizontalMirror = true;
      }
      if (isVerticalMirror(conn, otherConn)) {
        foundVerticalMirror = true;
      }
    }

    if (!foundHorizontalMirror) {
      horizontalSymmetric = false;
    }
    if (!foundVerticalMirror) {
      verticalSymmetric = false;
    }
  }

  if (horizontalSymmetric && verticalSymmetric) {
    return "Bi Symmetric";
  } else if (horizontalSymmetric) {
    return "X - Symmetric";
  } else if (verticalSymmetric) {
    return "Y - Symmetric";
  } else {
    return "Asymmetric";
  }
};
