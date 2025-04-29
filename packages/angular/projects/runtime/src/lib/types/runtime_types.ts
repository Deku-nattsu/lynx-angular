declare global {
  /**
   * Determines if code should be placed in the background thread, used as a compile-time define macro
   */
  let __BACKGROUND__: boolean;
  /**
   * Determines if code should be placed in the main thread, used as a compile-time define macro
   */
  let __MAIN_THREAD__: boolean;
  /**
   * Determines if running in dev mode
   */
  let __DEV__: boolean; //TODO: implement
  /**
   * Determines if running in profile mode
   */
  let __PROFILE__: boolean; //TODO: implement
}

export {};