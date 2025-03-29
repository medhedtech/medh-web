import { useState, useCallback, useEffect, useRef } from 'react';

export type ValidationRule<T> = {
  /**
   * Function to validate the field
   */
  validate: (value: any, formValues: T) => boolean;
  /**
   * Error message to display when validation fails
   */
  message: string;
};

export type FieldConfig<T> = {
  /**
   * Initial value of the field
   */
  initialValue: any;
  /**
   * Array of validation rules
   */
  validations?: ValidationRule<T>[];
  /**
   * Whether the field should be validated on change
   */
  validateOnChange?: boolean;
  /**
   * Whether the field should be validated on blur
   */
  validateOnBlur?: boolean;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Custom parser for the field value (e.g., to convert string to number)
   */
  parser?: (value: any) => any;
  /**
   * Whether to trim whitespace from string values
   */
  trim?: boolean;
  /**
   * Dependency fields that should trigger validation when they change
   */
  dependsOn?: (keyof T)[];
};

export type FormConfig<T> = {
  [K in keyof T]: FieldConfig<T>;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

export interface UseFormOptions<T> {
  /**
   * Initial form values
   */
  initialValues?: Partial<T>;
  /**
   * Whether to validate all fields on form submission
   */
  validateOnSubmit?: boolean;
  /**
   * Callback when form is submitted and valid
   */
  onSubmit?: (values: T) => void | Promise<void>;
  /**
   * Whether to reset the form after successful submission
   */
  resetOnSubmit?: boolean;
  /**
   * Callback when form validation fails on submission
   */
  onSubmitFailed?: (errors: FormErrors<T>) => void;
}

export interface UseFormResult<T> {
  /**
   * Current form values
   */
  values: T;
  /**
   * Form validation errors
   */
  errors: FormErrors<T>;
  /**
   * Which fields have been touched/blurred
   */
  touched: FormTouched<T>;
  /**
   * Whether the form is currently being submitted
   */
  isSubmitting: boolean;
  /**
   * Whether the form has been submitted at least once
   */
  isSubmitted: boolean;
  /**
   * Whether all required fields have a value
   */
  isValid: boolean;
  /**
   * Whether any field has been changed from its initial value
   */
  isDirty: boolean;
  /**
   * Set a specific field's value
   */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /**
   * Mark a field as touched (usually on blur)
   */
  setFieldTouched: <K extends keyof T>(field: K, isTouched?: boolean) => void;
  /**
   * Set a specific field's error
   */
  setFieldError: <K extends keyof T>(field: K, error: string | undefined) => void;
  /**
   * Handle form submission
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  /**
   * Reset form to initial values
   */
  resetForm: () => void;
  /**
   * Manually trigger validation for all fields
   */
  validateForm: () => boolean;
  /**
   * Manually trigger validation for a specific field
   */
  validateField: <K extends keyof T>(field: K) => boolean;
  /**
   * Get props for a field (onChange, onBlur, name, value)
   */
  getFieldProps: <K extends keyof T>(
    field: K
  ) => {
    name: string;
    value: T[K];
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
}

/**
 * Custom hook for form state management with validation
 * 
 * @param config Form field configuration
 * @param options Form behavior options
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  config: FormConfig<T>,
  options: UseFormOptions<T> = {}
): UseFormResult<T> {
  const {
    initialValues = {} as Partial<T>,
    validateOnSubmit = true,
    onSubmit,
    resetOnSubmit = false,
    onSubmitFailed,
  } = options;

  // Set up initial form state
  const getInitialValues = useCallback((): T => {
    const values = {} as T;
    for (const field in config) {
      const fieldConfig = config[field];
      values[field] = initialValues[field] !== undefined
        ? initialValues[field]
        : fieldConfig.initialValue;
    }
    return values;
  }, [config, initialValues]);

  // Form state
  const [values, setValues] = useState<T>(getInitialValues());
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // Keep track of initial values for dirty checking
  const initialValuesRef = useRef<T>(getInitialValues());

  // Check if form is valid
  const isValid = useCallback((): boolean => {
    // Check if all required fields have values
    for (const fieldName in config) {
      const field = config[fieldName];
      
      if (field.required && 
         (values[fieldName] === undefined || 
          values[fieldName] === null || 
          values[fieldName] === '')) {
        return false;
      }
      
      // Check if field has validation error
      if (errors[fieldName]) {
        return false;
      }
    }
    return true;
  }, [config, values, errors]);

  // Validate a specific field
  const validateField = useCallback(<K extends keyof T>(fieldName: K): boolean => {
    const fieldConfig = config[fieldName];
    const value = values[fieldName];
    
    // Skip validation if no validation rules
    if (!fieldConfig.validations || fieldConfig.validations.length === 0) {
      return true;
    }
    
    // Check each validation rule
    for (const rule of fieldConfig.validations) {
      const isValid = rule.validate(value, values);
      if (!isValid) {
        setErrors(prev => ({ ...prev, [fieldName]: rule.message }));
        return false;
      }
    }
    
    // Clear error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    return true;
  }, [config, values]);

  // Validate all form fields
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: FormErrors<T> = {};
    
    // Validate each field
    for (const fieldName in config) {
      const fieldConfig = config[fieldName];
      const value = values[fieldName];
      
      // Check required fields
      if (fieldConfig.required && 
         (value === undefined || 
          value === null || 
          value === '')) {
        newErrors[fieldName] = 'This field is required';
        isValid = false;
        continue;
      }
      
      // Skip further validation if no validation rules
      if (!fieldConfig.validations || fieldConfig.validations.length === 0) {
        continue;
      }
      
      // Check each validation rule
      for (const rule of fieldConfig.validations) {
        const ruleIsValid = rule.validate(value, values);
        if (!ruleIsValid) {
          newErrors[fieldName] = rule.message;
          isValid = false;
          break;
        }
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [config, values]);

  // Set a field's value
  const setFieldValue = useCallback(<K extends keyof T>(fieldName: K, value: T[K]): void => {
    const fieldConfig = config[fieldName];
    let parsedValue = value;
    
    // Apply parsing if configured
    if (fieldConfig.parser) {
      parsedValue = fieldConfig.parser(value);
    }
    
    // Apply trimming if configured and value is a string
    if (fieldConfig.trim && typeof parsedValue === 'string') {
      parsedValue = parsedValue.trim() as any;
    }
    
    setValues(prev => {
      const newValues = { ...prev, [fieldName]: parsedValue };
      
      // Check if the form is now dirty
      const initialValues = initialValuesRef.current;
      const isDirty = Object.keys(newValues).some(
        key => JSON.stringify(newValues[key]) !== JSON.stringify(initialValues[key])
      );
      setIsDirty(isDirty);
      
      return newValues;
    });
    
    // Validate on change if configured
    if (fieldConfig.validateOnChange) {
      validateField(fieldName);
    }
    
    // Validate dependent fields
    if (fieldConfig.dependsOn && fieldConfig.dependsOn.length > 0) {
      fieldConfig.dependsOn.forEach(dependentField => {
        validateField(dependentField as keyof T);
      });
    }
  }, [config, validateField]);

  // Mark a field as touched
  const setFieldTouched = useCallback(<K extends keyof T>(fieldName: K, isTouched: boolean = true): void => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));
    
    // Validate on blur if configured
    if (isTouched && config[fieldName].validateOnBlur) {
      validateField(fieldName);
    }
  }, [config, validateField]);

  // Set a field's error manually
  const setFieldError = useCallback(<K extends keyof T>(fieldName: K, error: string | undefined): void => {
    setErrors(prev => {
      if (error === undefined) {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
      return { ...prev, [fieldName]: error };
    });
  }, []);

  // Reset form to initial values
  const resetForm = useCallback((): void => {
    const initialValues = getInitialValues();
    initialValuesRef.current = initialValues;
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setIsDirty(false);
  }, [getInitialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
    }
    
    setIsSubmitted(true);
    
    // Validate all fields before submission if configured
    let formIsValid = true;
    if (validateOnSubmit) {
      formIsValid = validateForm();
    }
    
    if (!formIsValid) {
      if (onSubmitFailed) {
        onSubmitFailed(errors);
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(values);
      }
      
      // Reset form after submission if configured
      if (resetOnSubmit) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [validateOnSubmit, validateForm, errors, onSubmitFailed, onSubmit, values, resetOnSubmit, resetForm]);

  // Helper to get props for a field
  const getFieldProps = useCallback(<K extends keyof T>(fieldName: K) => {
    return {
      name: String(fieldName),
      value: values[fieldName],
      onChange: (e: React.ChangeEvent<any>) => {
        const value = e.target.type === 'checkbox' 
          ? e.target.checked 
          : e.target.value;
        setFieldValue(fieldName, value);
      },
      onBlur: () => setFieldTouched(fieldName),
      error: errors[fieldName],
      touched: !!touched[fieldName],
    };
  }, [values, errors, touched, setFieldValue, setFieldTouched]);

  // Reset form when config/initialValues change
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    isValid: isValid(),
    isDirty,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleSubmit,
    resetForm,
    validateForm,
    validateField,
    getFieldProps,
  };
}

export default useForm; 