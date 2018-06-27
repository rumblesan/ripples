const config = {
  sizeIncr: 0.5,
  widthIncr: 0.1,
  energyDecay: 0.95,
  cleanupThresh: 0.0001,
  startEnergy: 1,
  startWidth: 2,
  startSize: 0,
};

export const create = (xPos, yPos) => {
  const ripple = {
    energy: config.startEnergy,
    size: config.startSize,
    width: config.startWidth,
    xPos: xPos,
    yPos: yPos,
  };
  return ripple;
};

export const genHeightMap = (xPoints, yPoints) => {
  const heightMap = {
    x: xPoints,
    y: yPoints,
    heights: [],
  };
  let x, y;
  for (x = 0; x < heightMap.x; x += 1) {
    heightMap.heights[x] = [];
    for (y = 0; y < heightMap.y; y += 1) {
      heightMap.heights[x][y] = 0;
    }
  }
  return heightMap;
};

export const calcOffset = (ripple, t, x, y) => {
  const cellDistance = Math.sqrt(
    Math.pow(ripple.xPos - x, 2) + Math.pow(ripple.yPos - y, 2)
  );
  const diffDistance = cellDistance - ripple.size;
  const decay =
    Math.max(ripple.width - Math.abs(diffDistance), 0) / ripple.width;
  const heightVar = Math.sin(t - cellDistance) * decay * ripple.energy;

  return heightVar;
};

export const applyRipple = (ripple, t, heightMap) => {
  let x, y;
  for (x = 0; x < heightMap.x; x += 1) {
    for (y = 0; y < heightMap.y; y += 1) {
      heightMap.heights[x][y] += calcOffset(ripple, t, x, y);
    }
  }
};

export const update = ripples => {
  let remainingRipples = [];
  let r, i;
  for (i = 0; i < ripples.length; i += 1) {
    r = ripples[i];

    r.energy = r.energy * config.energyDecay;
    r.size += config.sizeIncr;
    r.width += config.widthIncr;

    if (r.energy > config.cleanupThresh) {
      remainingRipples.push(r);
    }
  }
  return remainingRipples;
};
