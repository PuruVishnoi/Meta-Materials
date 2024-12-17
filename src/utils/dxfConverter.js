export const convertToDXF = (connections) => {
  let dxfContent = `999
DXF created by Dot Connection App
  0
SECTION
  2
ENTITIES
`;

  connections.forEach((conn, index) => {
    dxfContent += `  0
LINE
  5
${index + 1}
  100
AcDbEntity
  8
0
  100
AcDbLine
 10
${conn.from.x}
 20
${conn.from.y}
 30
0.0
 11
${conn.to.x}
 21
${conn.to.y}
 31
0.0
`;
  });

  dxfContent += `  0
ENDSEC
  0
EOF`;

  return dxfContent;
};
