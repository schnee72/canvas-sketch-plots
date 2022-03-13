const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');

const settings = {
  dimensions: [320, 320],
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'px'
};

const sketch = (props) => {
  const { width, height, units } = props;
  let paths = [];
  const step = 7;
 
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      let path = createPath();
      const leftToRight = Math.random() >= 0.5;
      if (leftToRight) {
        path.moveTo(x, y);
        path.lineTo(x + step, y + step);
      } else {
        path.moveTo(x + step, y);
        path.lineTo(x, y + step);
      }
      paths.push(path);
    }
  }

  let lines = pathsToPolylines(paths, { units });

  const margin = 1; 
  const box = [ margin, margin, width - margin, height - margin ];
  lines = clipPolylinesToBox(lines, box);

  return props => renderPaths(lines, {
    ...props,
    lineCap: 'square',
    lineWidth: 2,
    optimize: true
  });
};

canvasSketch(sketch, settings);
