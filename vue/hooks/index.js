import { computed, getCurrentInstance, nextTick, unref } from "vue";

export const useVM = () => {
  const currentInstance = getCurrentInstance();
  return currentInstance.proxy;
};

export const useStore = () => {
  const vm = useVM();
  return vm.$store;
};

export const useSelectedProject = () => {
  const store = useStore();
  return computed(() => {
    return store.state.selectProject;
  });
};

export const useProjectID = () => {
  const selectProject = useSelectedProject();
  return computed(() => {
    return unref(selectProject).ProjectID;
  });
};

export const useSelectedCarNumber = () => {
  const selectedProject = useSelectedProject();
  return computed(() => {
    const CarNumbers = unref(selectedProject).CarNumbers;
    return CarNumbers && CarNumbers.length > 0 ? CarNumbers[0] : "";
  });
};

export const usePropsSync = (props, emit, prop) => {
  return computed({
    get() {
      return props[prop];
    },
    set(val) {
      emit(`update:${prop}`, val);
    },
  });
};

export const useButtonCodes = () => {
  const store = useStore();
  return computed(() => {
    return store.state.buttonCodes;
  });
};

/**
 * @param {string} defaultKey
 */
export const useKeyInOut = (defaultKey) => {
  let lastKey = defaultKey;

  /**
   * @param {string} key
   * @param {string} nextKey
   * @param {*} inFn
   * @param {*} outFn
   */
  function KeyInOut(key, nextKey, inFn, outFn) {
    if (lastKey !== key && nextKey !== key) {
      return;
    }
    // 进入 key
    if (lastKey !== key && nextKey === key) {
      inFn && inFn();
    } else if (lastKey === key && nextKey !== key) {
      outFn && outFn();
    } else {
      // do nothing
    }
    nextTick(() => {
      lastKey = nextKey;
    });
  }
  return KeyInOut;
};
