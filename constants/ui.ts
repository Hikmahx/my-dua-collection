/**
 * A Modal can't open (and an Alert can't show) while another modal is still closing: iOS ignores
 * it. Anything that follows a modal waits this long for that modal to finish closing.
 */
export const AFTER_MODAL_CLOSE_MS = 350
