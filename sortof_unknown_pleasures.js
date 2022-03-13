const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');

const settings = {
  dimensions: [320,320],
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'px'
};

const sketch = (props) => {
  const { width, height, units } = props;
  const step = 10;
  let lines = [];

  for (let i = 0; i <= width - step; i += step) {
    let line = [];
    for (let j = 0; j <= width - step; j += step) {
      const distanceToCenter = Math.abs(j - width / 2);
      const variance = Math.max(width / 2 - 50 - distanceToCenter, 0);
      const random = Math.random() * variance / 2 * -1;
      let point = {x: j, y: i + random}
      line.push(point);
    }
    lines.push(line);
  }

  let paths = [];

  for (let i = 5; i < lines.length; i++) {
    const path = createPath();
    path.moveTo(lines[i][0].x, lines[i][0].y);

    for (var j = 0; j < lines[i].length - 2; j++){
      const xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      const yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
      path.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
    }

    path.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
    paths.push(path);
  }

  let polyLines = pathsToPolylines(paths, { units });

  const margin = 1; 
  const box = [ margin, margin, width - margin, height - margin ];
  polyLines = clipPolylinesToBox(polyLines, box);

  return props => renderPaths(polyLines, {
    ...props,
    lineWidth: 2,
    optimize: true,
  });
};

canvasSketch(sketch, settings);
