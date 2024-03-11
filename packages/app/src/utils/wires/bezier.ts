type PointToDirection = 'left' | 'right' | 'top' | 'bottom';

type GetControlWithCurvatureParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  where: PointToDirection;
  curvature?: number;
};

type GetBezierPathCenterParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startControlX: number;
  startControlY: number;
  endControlX: number;
  endControlY: number;
};

type GetBezierPathParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTo?: PointToDirection;
  endFrom?: PointToDirection;
  curvature?: number;
};

function getControlWithCurvature({
  startX,
  startY,
  endX,
  endY,
  where,
  curvature = 0.25,
}: GetControlWithCurvatureParams): {
  controlX: number;
  controlY: number;
} {
  if (where === 'left')
    return {
      controlX: endX - calculateControlOffset(endX - startX, curvature),
      controlY: endY,
    };
  if (where === 'right')
    return {
      controlX: startX + calculateControlOffset(endX - startX, curvature),
      controlY: startY,
    };
  if (where === 'bottom')
    return {
      controlX: startX,
      controlY: startY + calculateControlOffset(endY - startY, curvature),
    };
  if (where === 'top')
    return {
      controlX: endX,
      controlY: endY - calculateControlOffset(endY - startY, curvature),
    };
  return { controlX: 0, controlY: 0 };
}

function calculateControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance;
  }

  return curvature * 25 * Math.sqrt(-distance);
}

export function getBezierPathCenter({
  startX,
  startY,
  endX,
  endY,
  startControlX,
  startControlY,
  endControlX,
  endControlY,
}: GetBezierPathCenterParams): {
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
} {
  // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
  const centerX: number =
    startX * 0.125 + startControlX * 0.375 + endControlX * 0.375 + endX * 0.125;
  const centerY: number =
    startY * 0.125 + startControlY * 0.375 + endControlY * 0.375 + endY * 0.125;

  const offsetX: number = Math.abs(centerX - startX);
  const offsetY: number = Math.abs(centerY - startY);

  return { centerX, centerY, offsetX, offsetY };
}

export function getBezierPath({
  startX,
  startY,
  endX,
  endY,
  startTo = 'right',
  endFrom = 'left',
  curvature = 0.25,
}: GetBezierPathParams): {
  path: string;
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
} {
  const { controlX: startControlX, controlY: startControlY } =
    getControlWithCurvature({
      startX,
      startY,
      endX,
      endY,
      where: startTo,
      curvature,
    });
  const { controlX: endControlX, controlY: endControlY } =
    getControlWithCurvature({
      startX,
      startY,
      endX,
      endY,
      where: endFrom,
      curvature,
    });

  const { centerX, centerY, offsetX, offsetY } = getBezierPathCenter({
    startX,
    startY,
    endX,
    endY,
    startControlX,
    startControlY,
    endControlX,
    endControlY,
  });

  return {
    path: `M${startX},${startY} C${startControlX},${startControlY} ${endControlX},${endControlY} ${endX},${endY}`,
    centerX,
    centerY,
    offsetX,
    offsetY,
  };
}
