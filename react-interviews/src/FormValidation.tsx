/**
 * Interview Question: React Technical Interview - Form Validation
 * 
 * Objective:
 * Create a controlled form component that validates user input in real-time.
 * This is a common React interview question testing your understanding of:
 * - Controlled components and form state
 * - React hooks (useState, useEffect, useCallback)
 * - Form validation logic
 * - TypeScript interfaces and types
 * - Error handling and display
 * 
 * Requirements:
 * - Create a registration form with the following fields:
 *   * Email (required, must be valid email)
 *   * Password (required, minimum 8 characters)
 *   * Confirm Password (must match password)
 *   * Age (optional, must be >= 18 if provided)
 * 
 * - Implement real-time validation
 * - Display error messages for each field
 * - Disable submit button if form is invalid
 * - Show success message on submit
 * - Handle form submission
 * 
 * Features to consider:
 * - Debounce validation for performance
 * - Accessibility (labels, ARIA attributes)
 * - User feedback (visual indicators)
 * - Clean error handling
 */

import React, { useState, useCallback, useMemo } from "react";

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  age?: number;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
}

export const FormValidationComponent: React.FC = () => {
  // TODO: Implement the form component
  
  /*
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    age: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = useCallback((email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return undefined;
  }, []);

  const validatePassword = useCallback((password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return undefined;
  }, []);

  const validateConfirmPassword = useCallback(
    (confirmPassword: string, password: string): string | undefined => {
      if (!confirmPassword) return "Confirm password is required";
      if (confirmPassword !== password) return "Passwords do not match";
      return undefined;
    },
    []
  );

  const validateAge = useCallback((age: number | undefined): string | undefined => {
    if (age !== undefined && age < 18) return "Must be at least 18 years old";
    return undefined;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );
    newErrors.age = validateAge(formData.age);

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  }, [formData, validateEmail, validatePassword, validateConfirmPassword, validateAge]);

  const isFormValid = useMemo(() => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return false;
    }
    return validateForm();
  }, [formData, validateForm]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === "number" ? (value ? parseInt(value) : undefined) : value,
      }));
    },
    []
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateForm()) {
        setSubmitted(true);
        console.log("Form submitted:", formData);
        setTimeout(() => setSubmitted(false), 3000);
      }
    },
    [formData, validateForm]
  );

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Registration Form</h2>
      
      {submitted && <div className="success-message">Form submitted successfully!</div>}

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={touched.email && errors.email ? "email-error" : undefined}
        />
        {touched.email && errors.email && (
          <span id="email-error" className="error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.password && !!errors.password}
          aria-describedby={touched.password && errors.password ? "password-error" : undefined}
        />
        {touched.password && errors.password && (
          <span id="password-error" className="error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
          aria-describedby={touched.confirmPassword && errors.confirmPassword ? "confirmPassword-error" : undefined}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span id="confirmPassword-error" className="error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.age && !!errors.age}
          aria-describedby={touched.age && errors.age ? "age-error" : undefined}
        />
        {touched.age && errors.age && (
          <span id="age-error" className="error">
            {errors.age}
          </span>
        )}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Submit
      </button>
    </form>
  );
  */

  return <div>Form component placeholder</div>;
};

export default FormValidationComponent;
