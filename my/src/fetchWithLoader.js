// src/utils/fetchWithLoader.js
import { loaderRef } from "./loaderRef";

export async function fetchWithLoader(url, options = {}) {
  const loader = loaderRef.current;
  if (loader) loader.showLoader();

  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    throw err;
  } finally {
    if (loader) loader.hideLoader();
  }
}
