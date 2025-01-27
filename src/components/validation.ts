/**
 * Represents a validation rule for a field.
 */
export interface ValidationRule {

    /**
     * The logic function to validate the field value.
     * @param value - The value to validate.
     * @returns A boolean indicating whether the validation passed.
     */
    logic: (value: string) => boolean
    /**
     * The error message to display if the validation fails.
     */
    errorMessage: string
}
/**
 * Represents a collection of validation rules for fields.
 */

export interface FieldRules {
    [key: string]: {
        [rule: string]: ValidationRule
    }
}

/**
 * A collection of predefined validation rules for various fields.
 */

export const validationRules: FieldRules = {
    name: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "Name is required",
        },
        minLength: {
            logic: (value) => value.length >= 3,
            errorMessage: "Name must be 3 characters or more",
        },
        maxLength: {
            logic: (value) => value.length <= 50,
            errorMessage: "Name must be 50 characters or less",
        },
    },
    email: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "Email is required",
        },
        format: {
            logic: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMessage: "Invalid email format",
        },
    },
    phone: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "Phone number is required",
        },
        format: {
            logic: (value) => /^\d{10}$/.test(value),
            errorMessage: "Phone number must be exactly 10 digits",
        },
    },
    dob: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "Date of birth is required",
        },
        validDate: {
            logic: (value) => {
                const date = new Date(value)
                return !isNaN(date.getTime())
            },
            errorMessage: "Invalid date format",
        },
        ageLimit: {
            logic: (value) => {
                const dob = new Date(value)
                const today = new Date()
                const age = today.getFullYear() - dob.getFullYear()
                return age >= 10 && age <= 100
            },
            errorMessage: "You must be between 10 and 100 years old",
        },
    },
    age: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "Age is required",
        },
        validRange: {
            logic: (value) => {
                const age = Number.parseInt(value, 10)
                return age >= 10 && age <= 100
            },
            errorMessage: "Age must be between 10 and 100",
        },
    },
    country: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "Country is required",
        },
    },
    state: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "State is required",
        },
    },
    city: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "City is required",
        },
    },
    zip: {
        required: {
            logic: (value) => value.trim() !== "",
            errorMessage: "ZIP code is required",
        },
        format: {
            logic: (value) => /^\d{5}(-\d{4})?$/.test(value),
            errorMessage: "Invalid ZIP code format (e.g., 12345 or 12345-6789)",
        },
    },
}

/**
 * Validates a field value against its associated validation rules.
 * 
 * @param fieldName - The name of the field to validate.
 * @param value - The value of the field to validate.
 * @returns An error message if validation fails, or `null` if validation passes.
 */

export function validateField(fieldName: string, value: string): string | null {
    const rules = validationRules[fieldName]
    if (!rules) return null

    for (const [ruleName, rule] of Object.entries(rules)) {
        if (!rule.logic(value)) {
            return rule.errorMessage
        }
    }

    return null
}

