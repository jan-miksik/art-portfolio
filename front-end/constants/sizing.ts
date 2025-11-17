/**
 * Sizing and dimension calculation constants
 */

/**
 * Multiplier to convert centimeters to pixels for display
 * 1cm = 5px on screen
 */
export const CM_TO_PX_MULTIPLIER = 5

/**
 * Threshold for large images (in pixels)
 * Images larger than this use different sizing calculations
 */
export const LARGE_IMAGE_THRESHOLD_PX = 2000

/**
 * Base size divisor for large images
 * Used in calculation: baseSize = 2000 / BASE_SIZE_DIVISOR
 */
export const BASE_SIZE_DIVISOR = 12

/**
 * Size reduction divisor for portions over threshold
 * Used in calculation: sizeOver2000 / SIZE_REDUCTION_DIVISOR
 */
export const SIZE_REDUCTION_DIVISOR = 70

/**
 * Pixel size divisor for regular images
 * Standard images are divided by this value for display
 */
export const STANDARD_PIXEL_DIVISOR = 9

/**
 * Pixel size divisor for Node Avatars with Digital Bitmap technique
 * Special case: these images use a different divisor
 */
export const NODE_AVATARS_DIGITAL_DIVISOR = 15

