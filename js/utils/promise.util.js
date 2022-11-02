var promiseUtil = (() => {
  const GlobalCacheObj = {
    AllPromise: {},
    AllResolve: {},
    AllReject: {},
  };

  function getReady(promiseID, nextCacheObj) {
    const { AllPromise, AllResolve, AllReject } =
      nextCacheObj || GlobalCacheObj;

    let mapPromise = AllPromise[promiseID];
    if (mapPromise === undefined) {
      console.warn(`promiseID: ${promiseID} is not register`);
      AllPromise[promiseID] = new Promise((resolve, reject) => {
        AllResolve[promiseID] = resolve;
        AllReject[promiseID] = reject;
      });
      mapPromise = AllPromise[promiseID];
    }
    return mapPromise;
  }

  function registerReady(promiseID, nextCacheObj) {
    const { AllPromise, AllResolve, AllReject } =
      nextCacheObj || GlobalCacheObj;
    let mapPromise = AllPromise[promiseID];
    if (mapPromise === undefined) {
      AllPromise[promiseID] = new Promise((resolve, reject) => {
        AllResolve[promiseID] = resolve;
        AllReject[promiseID] = reject;
      });
      mapPromise = AllPromise[promiseID];
    } else {
      console.warn(`promiseID: ${promiseID} is already register`);
    }
    return mapPromise;
  }

  function dispatchReady(promiseID, nextCacheObj) {
    const { AllResolve } = nextCacheObj || GlobalCacheObj;

    let mapCall = AllResolve[promiseID];
    if (mapCall === undefined) {
      console.warn(`can't dispatch promiseID: ${promiseID} is not register`);
      return;
    }
    mapCall();
  }

  function clearAllReady(nextCacheObj) {
    const cacheObj = nextCacheObj || GlobalCacheObj;
    cacheObj.AllPromise = {};
    cacheObj.AllResolve = {};
    cacheObj.AllReject = {};
  }

  function clearReady(promiseID, nextCacheObj) {
    const { AllPromise, AllResolve, AllReject } =
      nextCacheObj || GlobalCacheObj;
    const reject = AllReject[promiseID];
    if (reject) {
      reject("clearReady: ", promiseID);
      delete AllPromise[promiseID];
      delete AllResolve[promiseID];
      delete AllReject[promiseID];
    }
  }

  function getCacheObj() {
    return GlobalCacheObj;
  }

  function create() {
    const cacheObj = { AllPromise: {}, AllResolve: {}, AllReject: {} };
    return {
      getReady: (promiseID) => getReady(promiseID, cacheObj),
      registerReady: (promiseID) => registerReady(promiseID, cacheObj),
      dispatchReady: (promiseID) => dispatchReady(promiseID, cacheObj),
      clearAllReady: () => clearAllReady(cacheObj),
      clearReady: (promiseID) => clearReady(promiseID, cacheObj),
      getCacheObj: () => cacheObj,
    };
  }

  return {
    getReady,
    registerReady,
    dispatchReady,
    clearAllReady,
    clearReady,
    getCacheObj,
    create,
  };
})();
