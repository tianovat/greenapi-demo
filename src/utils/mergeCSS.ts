export const mergeCSS = (...arg: string[]) => {
  return arg.reduce((CSSClasses, CSSClass) => `${CSSClasses} ${CSSClass}`, "");
};
