export function registerGlobal(moduleName, value) {
  if (!window['nodearch']) window['nodearch'] = {};

  window.nodearch[moduleName] = value;
}