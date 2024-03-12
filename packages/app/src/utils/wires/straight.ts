type GetStraightPathCenterParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type GetStraightPathParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export function getStraightPathCenter({
  startX,
  startY,
  endX,
  endY,
}: GetStraightPathCenterParams): {
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
} {
  const centerX: number = (startX + endX) / 2;
  const centerY: number = (startY + endY) / 2;

  const offsetX: number = Math.abs(centerX - startX);
  const offsetY: number = Math.abs(centerY - startY);

  return { centerX, centerY, offsetX, offsetY };
}

export function getStraightPath({
  startX,
  startY,
  endX,
  endY,
}: GetStraightPathParams): {
  path: string;
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
} {
  const { centerX, centerY, offsetX, offsetY } = getStraightPathCenter({
    startX,
    startY,
    endX,
    endY,
  });

  return {
    path: `M${startX},${startY} L${endX},${endY}`,
    centerX,
    centerY,
    offsetX,
    offsetY,
  };
}
