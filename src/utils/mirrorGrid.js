export const mirrorGrid = (originalDots, originalConnections) => {
  const mirroredDots = [];
  const mirroredConnections = [];
  const gridSize = 300; // Assuming grid size is 300x300
  const gridCenter = { x: gridSize / 2, y: gridSize / 2 }; // Center of the grid (150, 150)

  const gridTransforms = [
    {
      xFlip: false,
      yFlip: false,
      translate: {
        x: 0,
        y: 0,
      },
    }, // Center (original)
    {
      xFlip: false,
      yFlip: true,
      translate: { x: 0, y: -gridSize },
    }, // Top
    {
      xFlip: false,
      yFlip: true,
      translate: { x: 0, y: gridSize },
    }, // Bottom
    {
      xFlip: true,
      yFlip: false,
      translate: { x: -gridSize, y: 0 },
    }, // Left
    {
      xFlip: true,
      yFlip: false,
      translate: { x: gridSize, y: 0 },
    }, // Right
    {
      xFlip: true,
      yFlip: true,
      translate: { x: gridSize, y: -gridSize },
    }, // Top-Right
    {
      xFlip: true,
      yFlip: true,
      translate: { x: -gridSize, y: gridSize },
    }, // Bottom-Left
    { rotate: 180, translate: { x: -gridSize, y: -gridSize } }, // Top-Left
    { rotate: 180, translate: { x: gridSize, y: gridSize } }, // Bottom-Right
  ];

  gridTransforms.forEach((transform, index) => {
    const transformedDots = originalDots.map((dot) => {
      let { x, y } = dot;

      // Apply flipping
      if (transform.xFlip) x = gridSize - x;
      if (transform.yFlip) y = gridSize - y;

      // Apply rotation
      if (transform.rotate) {
        const angle = (transform.rotate * Math.PI) / 180;
        const dx = x - gridCenter.x;
        const dy = y - gridCenter.y;
        const rotatedX =
          gridCenter.x + dx * Math.cos(angle) - dy * Math.sin(angle);
        const rotatedY =
          gridCenter.y + dx * Math.sin(angle) + dy * Math.cos(angle);
        x = rotatedX;
        y = rotatedY;
      }

      // Apply translation
      if (transform.translate) {
        x += transform.translate.x;
        y += transform.translate.y;
      }

      return {
        id: `${dot.id}-${index}`,
        x,
        y,
        row: dot.row,
        col: dot.col,
      };
    });

    // Transform connections for this grid
    const transformedConnections = originalConnections.map((conn) => {
      const fromTransformed = transformedDots.find((d) =>
        d.id.startsWith(`${conn.from.id}`)
      );
      const toTransformed = transformedDots.find((d) =>
        d.id.startsWith(`${conn.to.id}`)
      );
      return {
        from: fromTransformed,
        to: toTransformed,
      };
    });

    mirroredDots.push(...transformedDots);
    mirroredConnections.push(...transformedConnections);
  });

  return {
    dots: mirroredDots,
    connections: mirroredConnections,
    originalDots,
    originalConnections,
  };
};
