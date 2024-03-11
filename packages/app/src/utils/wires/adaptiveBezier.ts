type GetAdaptiveBezierPathParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type GetAdaptiveBezierPathCenterParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  curveX1: number;
  curveX2: number;
  middleY: number;
};

export function getAdaptiveBezierPathCenter({
  startX,
  startY,
  endX,
  endY,
  curveX1,
  curveX2,
  middleY,
}: GetAdaptiveBezierPathCenterParams): {
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
} {
  let centerX = 0;
  let centerY = 0;

  if (startX <= endX) {
    centerX = (startX + endX) / 2;
    centerY = (startY + endY) / 2;
  } else {
    const curveMidX: number = (curveX1 + curveX2) / 2;
    const curveMidY: number = (startY + endY) / 2;

    const lineMidX: number = (startX + endX) / 2;
    const lineMidY: number = middleY;

    centerX = (curveMidX + lineMidX) / 2;
    centerY = (curveMidY + lineMidY) / 2;
  }

  const offsetX: number = Math.abs(centerX - startX);
  const offsetY: number = Math.abs(centerY - startY);

  return { centerX, centerY, offsetX, offsetY };
}

export function getAdaptiveBezierPath({
  startX,
  startY,
  endX,
  endY,
}: GetAdaptiveBezierPathParams): {
  path: string;
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
} {
  const deltaX: number = Math.abs(endX - startX);
  const offsetDistance: number =
    startX <= endX ? deltaX * 0.5 : Math.abs(endY - startY) * 0.6;

  const curveX1: number = startX + offsetDistance;
  const curveY1: number = startY;
  const curveX2: number = endX - offsetDistance;
  const curveY2: number = endY;

  const middleY: number = (endY + startY) / 2;

  const path: string =
    startX <= endX
      ? `M${startX},${startY} C${curveX1},${curveY1} ${curveX2},${curveY2} ${endX},${endY}`
      : `M${startX},${startY} C${curveX1},${curveY1} ${curveX1},${middleY} ${startX},${middleY} ` +
        `L${endX},${middleY} C${curveX2},${middleY} ${curveX2},${curveY2} ${endX},${endY}`;

  const { centerX, centerY, offsetX, offsetY } = getAdaptiveBezierPathCenter({
    startX,
    startY,
    endX,
    endY,
    curveX1,
    curveX2,
    middleY,
  });

  return { path, centerX, centerY, offsetX, offsetY };
}
