export type PluginAngularLynxOptions = {
  customCSSInheritanceList?: string[] | undefined;
  debugInfoOutside?: boolean;
  defaultDisplayLinear?: boolean;
  defaultOverflowVisible?: boolean;
  enableA11y?: boolean;
  enableAccessibilityElement?: boolean;
  enableICU?: boolean;
  enableCSSInheritance?: boolean;
  enableCSSInvalidation?: boolean;
  enableCSSSelector?: boolean;
  enableNewGesture?: boolean;
  enableParallelElement?: boolean;
  enableRemoveCSSScope?: boolean;
  pipelineSchedulerConfig?: number;
  removeDescendantSelectorScope?: boolean;
  targetSdkVersion?: string;
  experimental_isLazyBundle?: boolean;
};

export function normalizeOptions(
  options?: Partial<PluginAngularLynxOptions>
): Required<PluginAngularLynxOptions> {
  const defaultOptions: Required<PluginAngularLynxOptions> = {
    //@ts-ignore
    customCSSInheritanceList: undefined,
    debugInfoOutside: true,
    enableICU: false,
    enableA11y: true,
    enableAccessibilityElement: false,
    enableCSSInheritance: false,
    enableCSSInvalidation: false,
    enableCSSSelector: true,
    enableNewGesture: false,
    enableParallelElement: true,
    defaultDisplayLinear: true,
    enableRemoveCSSScope: false,
    pipelineSchedulerConfig: 0x00010000,
    targetSdkVersion: "3.2",
    defaultOverflowVisible: true,
    removeDescendantSelectorScope: false,
    experimental_isLazyBundle: false,
  };
  return Object.assign(defaultOptions, options);
}
