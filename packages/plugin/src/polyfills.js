if(typeof performance === 'undefined'){
    globalThis.performance = undefined;
  }; 
  if(typeof queueMicrotask === 'undefined'){
    globalThis.queueMicrotaskPromiseCache = Promise.resolve();
    globalThis.queueMicrotask = (cb)=> globalThis.queueMicrotaskPromiseCache.then(cb);
  }