import { getStraightPathCenter } from './straight';

type PointToDirection = 'left' | 'right' | 'top' | 'bottom';

type GetStepPointsParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTo?: PointToDirection;
  endFrom?: PointToDirection;
  centerX?: number;
  centerY?: number;
  offset?: number;
};

type GetStepPathParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTo?: PointToDirection;
  endFrom?: PointToDirection;
  centerX?: number;
  centerY?: number;
  borderRadius?: number;
  offset?: number;
};

const distance = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
) =>
  Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2),
  );

const direction = (where: PointToDirection) => {
  if (where === 'left') return { x: -1, y: 0 };
  if (where === 'right') return { x: 1, y: 0 };
  if (where === 'bottom') return { x: 0, y: -1 };
  if (where === 'top') return { x: 0, y: 1 };
  return { x: 0, y: 0 };
};

function getDirection(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  axis: 'x' | 'y',
) {
  if (axis === 'y') {
    return startY < endY ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  return startX < endX ? { x: 1, y: 0 } : { x: -1, y: 0 };
}

function getBend(
  startPoint: { x: number; y: number },
  midPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  size: number,
) {
  const bendSize = Math.min(
    distance(startPoint, midPoint) / 2,
    distance(midPoint, endPoint) / 2,
    size,
  );
  const { x, y } = midPoint;

  // no bend
  if (
    (startPoint.x === x && x === endPoint.x) ||
    (startPoint.y === y && y === endPoint.y)
  ) {
    return `L${x} ${y}`;
  }

  // first segment is horizontal
  if (startPoint.y === y) {
    const xDir = startPoint.x < endPoint.x ? -1 : 1;
    const yDir = startPoint.y < endPoint.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${
      y + bendSize * yDir
    }`;
  }

  const xDir = startPoint.x < endPoint.x ? 1 : -1;
  const yDir = startPoint.y < endPoint.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

export function getStepPoints({
  startX,
  startY,
  endX,
  endY,
  startTo = 'right',
  endFrom = 'left',
  centerX,
  centerY,
  offset = 20,
}: GetStepPointsParams) {
  // Direction follows: x: 1 - to right, -1 - to left; y: 1 - to top, -1 - to bottom;
  const startToDirection = direction(startTo);
  const endFromDirection = direction(endFrom);

  // Position follows: x - horizontal location; y - vertical location;
  const start = { x: startX, y: startY };
  const end = { x: endX, y: endY };

  // Gapped position follows: x - horizontal location; y - vertical location;
  // offset tells the distance between the port and the intermediate step point
  const startGapped = {
    x: startX + startToDirection.x * offset,
    y: startY + startToDirection.y * offset,
  };
  const endGapped = {
    x: endX + endFromDirection.x * offset,
    y: endY + endFromDirection.y * offset,
  };

  const pathDirection = getDirection(
    startGapped.x,
    endGapped.y,
    endGapped.x,
    endGapped.y,
    'x',
  );

  const axis = pathDirection.x !== 0 ? 'x' : 'y';
  const currDirection = pathDirection[axis];

  let points: { x: number; y: number }[] = [];
  const center = { x: 0, y: 0 };

  const sourceGapOffset = { x: 0, y: 0 };
  const targetGapOffset = { x: 0, y: 0 };

  // the center of step path equals the center of the straight path
  const {
    centerX: defaultCenterX,
    centerY: defaultCenterY,
    offsetX: defaultOffsetX,
    offsetY: defaultOffsetY,
  } = getStraightPathCenter({
    startX,
    startY,
    endX,
    endY,
  });

  // in default, the startTo and endFrom have opposite directions
  if (startToDirection[axis] * endFromDirection[axis] === -1) {
    center['x'] = centerX ?? defaultCenterX;
    center['y'] = centerY ?? defaultCenterY;

    //     --- o
    //     |
    // o ---
    const verticalSplit = [
      { x: center['x'], y: startGapped.y },
      { x: center['x'], y: endGapped.y },
    ];
    //    o
    //    |
    //  ---
    //  |
    //  o
    const horizontalSplit = [
      { x: startGapped.x, y: center['y'] },
      { x: endGapped.x, y: center['y'] },
    ];

    // get the intermediate step points
    if (startToDirection[axis] === currDirection) {
      points = axis === 'x' ? verticalSplit : horizontalSplit;
    } else {
      points = axis === 'x' ? horizontalSplit : verticalSplit;
    }
  } else {
    // if the startTo and endFrom have the same direction, then it means either the start
    // or the end port need to be surrounded by additional intermediate steps
    // for example:
    //   o
    //   |
    // ---
    // | o
    // | |
    // ---

    // startEnd means we take x from start and y from end, endStart is the opposite
    const startEnd = [{ x: startGapped.x, y: endGapped.y }];
    const endStart = [{ x: endGapped.x, y: startGapped.y }];

    // this handles edges with same handle positions
    if (axis === 'x') {
      points = startToDirection.x === currDirection ? endStart : startEnd;
    } else {
      points = startToDirection.y === currDirection ? startEnd : endStart;
    }

    if (startTo === endFrom) {
      // if path goes from Right to Right for example (startTo === endFrom) and the
      // distance between start.x and end.x is less than the offset, the added point
      // and the gapped start/end will overlap. This leads to a weird path.
      // To avoid this we add a gapOffset to the start/end

      const diff = Math.abs(start[axis] - end[axis]);
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (startToDirection[axis] === currDirection) {
          sourceGapOffset[axis] =
            (startGapped[axis] > start[axis] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[axis] =
            (endGapped[axis] > end[axis] ? -1 : 1) * gapOffset;
        }
      }
    } else {
      // these are conditions for handling mixed handle positions like Right -> Bottom

      const axisOpposite = axis === 'x' ? 'y' : 'x';

      const isSameDirection =
        startToDirection[axis] === endFromDirection[axisOpposite];

      const startGtEndOppo =
        startGapped[axisOpposite] > endGapped[axisOpposite];
      const startLtEndOppo =
        startGapped[axisOpposite] < endGapped[axisOpposite];
      const flipSourceTarget =
        (startToDirection[axis] === 1 &&
          ((!isSameDirection && startGtEndOppo) ||
            (isSameDirection && startLtEndOppo))) ||
        (startToDirection[axis] !== 1 &&
          ((!isSameDirection && startLtEndOppo) ||
            (isSameDirection && startGtEndOppo)));

      if (flipSourceTarget) {
        points = axis === 'x' ? startEnd : endStart;
      }
    }

    const sourceGapPoint = {
      x: startGapped.x + sourceGapOffset.x,
      y: startGapped.y + sourceGapOffset.y,
    };
    const targetGapPoint = {
      x: endGapped.x + targetGapOffset.x,
      y: endGapped.y + targetGapOffset.y,
    };
    const maxXDistance = Math.max(
      Math.abs(sourceGapPoint.x - points[0].x),
      Math.abs(targetGapPoint.x - points[0].x),
    );
    const maxYDistance = Math.max(
      Math.abs(sourceGapPoint.y - points[0].y),
      Math.abs(targetGapPoint.y - points[0].y),
    );

    // get the center from the longgest middle path
    if (maxXDistance >= maxYDistance) {
      center['x'] = (sourceGapPoint.x + targetGapPoint.x) / 2;
      center['y'] = points[0].y;
    } else {
      center['x'] = points[0].x;
      center['y'] = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }

  const pathPoints = [
    start,
    {
      x: startGapped.x + sourceGapOffset.x,
      y: startGapped.y + sourceGapOffset.y,
    },
    ...points,
    {
      x: endGapped.x + targetGapOffset.x,
      y: endGapped.y + targetGapOffset.y,
    },
    end,
  ];

  return {
    points: pathPoints,
    centerX: center['x'],
    centerY: center['y'],
    offsetX: defaultOffsetX,
    offsetY: defaultOffsetY,
  };
}

export function getStepPath({
  startX,
  startY,
  endX,
  endY,
  startTo = 'right',
  endFrom = 'left',
  centerX,
  centerY,
  borderRadius = 5,
  offset = 20,
}: GetStepPathParams) {
  const {
    points,
    centerX: newCenterX,
    centerY: newCenterY,
    offsetX,
    offsetY,
  } = getStepPoints({
    startX,
    startY,
    endX,
    endY,
    startTo,
    endFrom,
    centerX,
    centerY,
    offset,
  });

  const path = points.reduce<string>((res, p, i) => {
    let segment = '';

    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
    }

    res += segment;

    return res;
  }, '');

  return {
    path,
    centerX: newCenterX,
    centerY: newCenterY,
    offsetX,
    offsetY,
  };
}
