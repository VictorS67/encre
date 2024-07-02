import * as T from ".";

let GLOBAL_MAP = new Map();

export const init: T.Init = function () {
  GLOBAL_MAP = new Map();
};

export const get: T.Get = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      const req = GLOBAL_MAP.get(key);
      resolve(req);
    } catch (e) {
      reject(e);
    }
  });
};

export const set: T.Set = async function (key, value) {
  new Promise((resolve, reject) => {
    try {
      GLOBAL_MAP.set(key, value);
      resolve(undefined);
    } catch (e) {
      reject(e);
    }
  });
};

export const remove: T.Remove = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      GLOBAL_MAP.delete(key);
      resolve(undefined);
    } catch (e) {
      reject(e);
    }
  });
};

export const multiGet: T.MultiGet = async function (keys) {
  const promise = Promise.all(
    keys.map((key) => {
      return new Promise<[string, string]>((resolve, reject) => {
        try {
          const req = GLOBAL_MAP.get(key);
          resolve([key, req]);
        } catch (e) {
          reject(e);
        }
      });
    }),
  );

  return promise;
};

export const multiSet: T.MultiSet = async function (keyValues) {
  const promise = Promise.all(
    keyValues.map(([key, value]) => {
      return new Promise((resolve, reject) => {
        try {
          GLOBAL_MAP.set(key, value);
          resolve(undefined);
        } catch (e) {
          reject(e);
        }
      });
    }),
  );

  return promise;
};

export const multiRemove: T.MultiRemove = async function (keys) {
  const promise = Promise.all(
    keys.map((key) => {
      return new Promise((resolve, reject) => {
        try {
          GLOBAL_MAP.delete(key);
          resolve(undefined);
        } catch (e) {
          reject(e);
        }
      });
    }),
  );

  return promise;
};
