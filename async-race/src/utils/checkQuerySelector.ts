export function checkQuerySelector<T extends HTMLElement>(selector: string, root?: Document | Element): T {
  if (root) {
    const element = root.querySelector<T>(selector);

    if (!element) {
      throw Error(`An element with selector '${selector}' is null`);
    }

    return element;
  }

  const element = document.querySelector<T>(selector);

  if (!element) {
    throw Error(`An element with selector '${selector}' is null`);
  }

  return element;
}
