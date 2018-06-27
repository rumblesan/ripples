import { Vector3, Geometry, Face3 } from 'three';

export const createPoints = (xPoints, yPoints, tileSize) => {
  const points = {
    xPoints: xPoints,
    yPoints: yPoints,
    p: [],
  };

  let x, y;
  for (x = 0; x < xPoints; x += 1) {
    points.p[x] = [];
    for (y = 0; y < yPoints; y += 1) {
      points.p[x][y] = new Vector3(x * tileSize, y * tileSize, 0);
    }
  }

  return points;
};

export const createGeometry = points => {
  const geometry = new Geometry();

  let x, y;
  for (x = 0; x < points.xPoints; x += 1) {
    for (y = 0; y < points.yPoints; y += 1) {
      geometry.vertices.push(points.p[x][y]);
    }
  }

  const triangles = [];

  let p1, p2, p3;
  // Don't want to iterate over last row/column
  // Also ordering of points is important
  for (x = 0; x < points.xPoints - 1; x += 1) {
    for (y = 0; y < points.yPoints - 1; y += 1) {
      p1 = y + x * points.yPoints;
      p2 = y + (x + 1) * points.yPoints;
      p3 = y + (x + 1) * points.yPoints + 1;
      triangles.push(new Face3(p1, p2, p3));

      p1 = y + x * points.yPoints;
      p2 = y + (x + 1) * points.yPoints + 1;
      p3 = y + x * points.yPoints + 1;
      triangles.push(new Face3(p1, p2, p3));
    }
  }

  let t;
  for (t = 0; t < triangles.length; t += 1) {
    geometry.faces.push(triangles[t]);
  }

  geometry.computeBoundingSphere();

  return geometry;
};
