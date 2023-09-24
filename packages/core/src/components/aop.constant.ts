export enum AdviceKey {
  BEFORE,
  AFTER,
  AROUND,
  AFTER_RETURNING,
  AFTER_THROWING,
  AFTER_FINALLY
}

export enum AOPKey {
  ADVICE,
  ASPECT,
  POINT_CUT,
  PROXY
}

export enum PointCutMethod {
  ALL = 'all_point_cut'
}

