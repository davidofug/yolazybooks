import { authFormSchema } from "../utils/validators/loginValidator";

describe("Login Form Schema Validation", () => {
  test("validates valid form data", () => {
    const validFormData = {
      phone: "1234567890",
      password: "password123",
    };

    const result = authFormSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });

  test("fails validation for invalid form data", () => {
    const invalidFormData = {
      phone: "1234", // Invalid phone number length
      password: "", // Empty password
    };

    const result = authFormSchema.safeParse(invalidFormData);
    expect(result.success).toBe(false);
  });

  test.each([
    ["", "", false], // Empty input
    ["1234567890", "password", true], // Valid input
    ["123", "password", false], // Invalid phone length
    ["1234567890123", "password", false], // Invalid phone length (too long)
    ["1234567890", "pass", false], // Invalid password length
    ["1".repeat(10), "p".repeat(8), true], // Minimum allowed values
    ["1".repeat(10), "p".repeat(1000), true], // Maximum allowed values (if applicable)
  ])(
    "validates input (phone: %s, password: %s) as %s",
    (phone, password, valid) => {
      const formData = { phone, password };
      const result = authFormSchema.safeParse(formData);
      expect(result.success).toBe(valid);
    }
  );

  test.each([
    ["1234567890", "password", true], // Valid input
    ["1234567890  ", "password", false], // Trailing space in phone
    [" 1234567890", "password", false], // Leading space in phone
    ["  1234567890   ", "password", false], // Leading and trailing spaces in phone
    ["+1234567890", "password", false], // Invalid phone format (with +)
    ["123-456-7890", "password", false], // Phone with hyphens (invalid format)
    ["(123) 456-7890", "password", false], // Phone with parentheses (invalid format)
    ["1234567890", " password", true], // Trailing space in password
    ["1234567890", "password ", true], // Leading space in password
    ["1234567890", "   password   ", true], // Leading and trailing spaces in password
    ["1234567890", "p@ssword", true], // Valid special characters in password
    ["1234567890", "password$#", true], // Valid special characters in password
    ["1234567890", "pa ssword", true], // Valid space in password
    ["1234567890", "    ", false], // Invalid password (empty)
    ["1234567890", "\t\t", false], // Invalid password (tabs only)
    ["📞1234567890", "password", false], // Multilingual characters in phone
    ["1234567890", "🔑password", true], // Multilingual characters in password
  ])(
    "validates input (phone: %s, password: %s) as %s",
    (phone, password, valid) => {
      const formData = { phone, password };
      const result = authFormSchema.safeParse(formData);
      expect(result.success).toBe(valid);
    }
  );
});
