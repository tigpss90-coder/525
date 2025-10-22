export interface ValidationLimits {
  width: { min: number; max: number };
  height: { min: number; max: number };
  fontSize: { min: number; max: number };
  fontWeight: { min: number; max: number };
}

export const DEFAULT_LIMITS: ValidationLimits = {
  width: { min: 10, max: 2000 },
  height: { min: 10, max: 2000 },
  fontSize: { min: 8, max: 200 },
  fontWeight: { min: 100, max: 900 },
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateWidth(value: number, limits = DEFAULT_LIMITS): ValidationResult {
  if (value < limits.width.min) {
    return { isValid: false, error: `Width must be at least ${limits.width.min}px` };
  }
  if (value > limits.width.max) {
    return { isValid: false, error: `Width cannot exceed ${limits.width.max}px` };
  }
  return { isValid: true };
}

export function validateHeight(value: number, limits = DEFAULT_LIMITS): ValidationResult {
  if (value < limits.height.min) {
    return { isValid: false, error: `Height must be at least ${limits.height.min}px` };
  }
  if (value > limits.height.max) {
    return { isValid: false, error: `Height cannot exceed ${limits.height.max}px` };
  }
  return { isValid: true };
}

export function validateFontSize(value: number, limits = DEFAULT_LIMITS): ValidationResult {
  if (value < limits.fontSize.min) {
    return { isValid: false, error: `Font size must be at least ${limits.fontSize.min}px` };
  }
  if (value > limits.fontSize.max) {
    return { isValid: false, error: `Font size cannot exceed ${limits.fontSize.max}px` };
  }
  return { isValid: true };
}

export function validateFontWeight(value: number, limits = DEFAULT_LIMITS): ValidationResult {
  if (value < limits.fontWeight.min) {
    return { isValid: false, error: `Font weight must be at least ${limits.fontWeight.min}` };
  }
  if (value > limits.fontWeight.max) {
    return { isValid: false, error: `Font weight cannot exceed ${limits.fontWeight.max}` };
  }
  if (value % 100 !== 0) {
    return { isValid: false, error: 'Font weight must be a multiple of 100 (100-900)' };
  }
  return { isValid: true };
}
