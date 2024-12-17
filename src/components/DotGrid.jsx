"use client";

import { useEffect, useState } from "react";

import { mirrorGrid } from "@/utils/mirrorGrid";
import { convertToDXF } from "../utils/dxfConverter";
import { checkSymmetry } from "@/utils/checkSymmetry";
import { validateConnection } from "@/utils/validateConnection";

const DotGrid = () => {
  const [gridSize] = useState(3);
  const [error, setError] = useState("");
  const [connections, setConnections] = useState([]);
  const [selectedDots, setSelectedDots] = useState([]);

  const [boundaryNodes, setBoundaryNodes] = useState({
    left: [],
    right: [],
    top: [],
    bottom: [],
  });
  const [symmetry, setSymmetry] = useState("");
  const [nodePoints, setNodePoints] = useState([]);
  const [volumeFraction, setVolumeFraction] = useState(0);
  const [connectionsList, setConnectionsList] = useState([]);
  const [mirrorNodePoints, setMirrorNodePoints] = useState([]);
  const [mirrorConnectionsList, setMirrorConnectionsList] = useState([]);

  const createDots = () => {
    const dots = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        dots.push({
          id: row * gridSize + col + 1,
          x: col * 100 + 50,
          y: row * 100 + 50,
          row,
          col,
        });
      }
    }
    return dots;
  };

  const dots = createDots();

  useEffect(() => {
    const maxConnections = (gridSize - 1) * gridSize * 2;
    const fraction = (connections.length / maxConnections).toFixed(2);
    setVolumeFraction(fraction);

    const pointsArray = dots.map((dot) => [dot.id, dot.x, dot.y]);
    setNodePoints(pointsArray);

    const connArray = connections.map((conn, index) => [
      index + 1,
      conn.from.id,
      conn.to.id,
    ]);

    setConnectionsList(connArray);

    setSymmetry(checkSymmetry(connections, 3));

    const mirroredDesign = mirrorGrid(dots, connections);

    setMirrorNodePoints(mirroredDesign.dots);
    setMirrorConnectionsList(mirroredDesign.connections);

    const leftNodes = dots.filter((dot) => dot.col === 0).map((dot) => dot.id);
    const rightNodes = dots
      .filter((dot) => dot.col === gridSize - 1)
      .map((dot) => dot.id);
    const topNodes = dots.filter((dot) => dot.row === 0).map((dot) => dot.id);
    const bottomNodes = dots
      .filter((dot) => dot.row === gridSize - 1)
      .map((dot) => dot.id);

    setBoundaryNodes({
      left: leftNodes,
      right: rightNodes,
      top: topNodes,
      bottom: bottomNodes,
    });
  }, [connections, gridSize]);

  const handleDotClick = (dot) => {
    setError("");

    if (
      selectedDots.length > 0 &&
      selectedDots[selectedDots.length - 1].id === dot.id
    )
      return;

    if (selectedDots.length > 0) {
      const lastDot = selectedDots[selectedDots.length - 1];
      const newConnection = {
        from: lastDot,
        to: dot,
      };

      if (
        validateConnection(newConnection, connections, selectedDots, setError)
      ) {
        setConnections((prev) => [...prev, newConnection]);
        setSelectedDots((prev) => [...prev, dot]);
      }
    } else {
      setSelectedDots([dot]);
    }
  };

  const resetDesign = () => {
    setConnections([]);
    setSelectedDots([]);
    setError("");
  };

  const downloadDesign = () => {
    if (connections.length === 0) {
      setError("Please create a design first");
      return;
    }

    try {
      const dxfContent = convertToDXF(connections);

      const blob = new Blob([dxfContent], { type: "application/dxf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "dot_connection_design.dxf";
      link.click();
    } catch (err) {
      setError("Failed to convert design to DXF");
      console.error(err);
    }
  };

  const renderMirrorGrid = (dots, connections) => {
    return (
      <svg width="900" height="900" className="border border-gray-300 bg-white">
        {connections.map((conn, index) => (
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

        {dots.map((dot) => (
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
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col items-center gap-5">
          <svg
            width="300"
            height="300"
            className="border-2 border-gray-300 bg-white"
          >
            {dots.map((dot) => (
              <circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r="8"
                className="fill-blue-500 cursor-pointer hover:fill-blue-700 transition-colors"
                onClick={() => handleDotClick(dot)}
              />
            ))}

            {connections.map((conn, index) => (
              <line
                key={index}
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="black"
                strokeWidth="2"
                className="stroke-current text-gray-800"
              />
            ))}
          </svg>

          <p className="text-xl">
            <span className="font-bold">Symmetry: </span>
            {symmetry}
          </p>
        </div>

        <div className="text-left text-xl space-y-5">
          <p>
            <span className="font-bold">Volume Fraction: </span>
            {volumeFraction}
          </p>
          <p className="w-1/2">
            <span className="font-bold">Node Points: </span>
            {JSON.stringify(nodePoints)}
          </p>
          <p className="w-1/2">
            <span className="font-bold">Connections List: </span>
            {JSON.stringify(connectionsList)}
          </p>
          <p>
            <span className="font-bold">Boundary Nodes: </span>
            Left: {JSON.stringify(boundaryNodes.left)} | Right:{" "}
            {JSON.stringify(boundaryNodes.right)} | Top:{" "}
            {JSON.stringify(boundaryNodes.top)} | Bottom:{" "}
            {JSON.stringify(boundaryNodes.bottom)}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={downloadDesign}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Download Design
            </button>
            <button
              onClick={resetDesign}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Reset Design
            </button>
          </div>
        </div>
      </div>

      {renderMirrorGrid(mirrorNodePoints, mirrorConnectionsList)}
    </div>
  );
};

export default DotGrid;
