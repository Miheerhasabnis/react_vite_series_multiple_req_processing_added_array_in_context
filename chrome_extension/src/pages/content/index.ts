console.log("content loadeddddddddd");

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./components/Demo");
