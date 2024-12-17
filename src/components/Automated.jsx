"use client";

import { useEffect, useState } from "react";

import { mirrorGrid } from "@/utils/mirrorGrid";
import { convertToDXF } from "@/utils/dxfConverter";
import { checkSymmetry } from "@/utils/checkSymmetry";
import { validateDesign } from "@/utils/validateDesign";
import { generateAllDesigns } from "@/utils/generateAllDesigns";
import { calculateStiffnessTensor } from "@/utils/calculateStiffnessTensor";

const Automated = () => {
  const [gridSize] = useState(3);
  const [finalDesigns, setFinalDesigns] = useState(null);

  useEffect(() => {
    const originalDots = createDots();
    const allDesigns = generateAllDesigns(originalDots);

    const validDesigns = allDesigns.filter(validateDesign);

    const mirroredDesigns = validDesigns.map((design) => {
      return mirrorGrid(originalDots, design);
    });

    const designsWithStiffness = mirroredDesigns
      .map((design) => {
        const stiffnessTensor = calculateStiffnessTensor(
          design.dots,
          design.connections
        );

        const symmetry = checkSymmetry(design.originalConnections, 9);

        if (
          stiffnessTensor &&
          stiffnessTensor[0] &&
          stiffnessTensor[0][0] !== undefined
        ) {
          return {
            connections: design.connections,
            stiffnessTensor,
            symmetry,
            originalDots: design.originalDots,
            originalConnections: design.originalConnections,
            dots: design.dots, // Include the specific dots used for this design
          };
        }

        return null;
      })
      .filter(Boolean);

    designsWithStiffness.sort((a, b) => {
      const stiffnessA = a.stiffnessTensor[0][0];
      const stiffnessB = b.stiffnessTensor[0][0];
      return stiffnessB - stiffnessA;
    });

    setFinalDesigns(designsWithStiffness.slice(0, 10));
  }, []);

  const createDots = () => {
    const dots = [];
    const horizontalOffset = randomOffset();
    const verticalOffset = randomOffset();
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let x = col * 100 + 50;
        let y = row * 100 + 50;

        // Uncomment the following to apply offsets
        // if (row === 0 && col === 1) x += verticalOffset; // Top middle
        // if (row === 2 && col === 1) x += verticalOffset; // Bottom middle
        // if (row === 1 && col === 0) y += horizontalOffset; // Left middle
        // if (row === 1 && col === 2) y += horizontalOffset; // Right middle
        // if (row === 1 && col === 1) {
        //   x += randomOffset(); // Center
        //   y += randomOffset();
        // }

        dots.push({ id: row * gridSize + col + 1, x, y, row, col });
      }
    }
    return dots;
  };

  const randomOffset = () => Math.floor(Math.random() * 101) - 50;

  const downloadDesign = (connections) => {
    try {
      const dxfContent = convertToDXF(connections);

      const blob = new Blob([dxfContent], { type: "application/dxf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "best_design.dxf";
      link.click();
    } catch (err) {
      setError("Failed to convert design to DXF");
      console.error(err);
    }
  };

  const renderGrid = (design) => {
    if (!design) return null;

    return (
      <svg width="900" height="900" className="border border-gray-300 bg-white">
        {design.connections.map((conn, index) => (
          <line
            key={index}
            x1={conn.from.x + 300}
            y1={conn.from.y + 300}
            x2={conn.to.x + 300}
            y2={conn.to.y + 300}
            stroke="black"
            strokeWidth="2"
          />
        ))}

        {design.dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.x + 300}
            cy={dot.y + 300}
            r="5"
            className="fill-blue-500"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 gap-10">
      <p className="text-center text-2xl font-bold">
        Automated Design Generation
      </p>

      {finalDesigns?.map((design, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-5 bg-white p-5"
        >
          {renderGrid(design)}

          <div className="flex flex-row items-center gap-10">
            <h3 className="text-center text-xl font-bold">
              Stiffness: {design.stiffnessTensor[0][0].toFixed(2)}
            </h3>

            <h3 className="text-center text-xl font-bold">
              Symmetry: {design.symmetry}
            </h3>

            <button
              onClick={() => downloadDesign(design.connections)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download DXF
            </button>
          </div>
        </div>
      ))}

      {renderGrid()}
    </div>
  );
};

export default Automated;
