Feature: Generate Coupons for Garage Promotions

  Scenario: Administrator generates a coupon for a garage promotion
    Given a garage with ID "GARAGE_ID"
    When the administrator generates a coupon for a promotional offer or discount for the garage with ID "GARAGE_ID"
    Then a unique coupon code is generated
    And the coupon is associated with the garage with ID "GARAGE_ID"
    And the coupon details, such as the discount amount or offer description, are specified

  Scenario: Administrator encounters an error while generating a coupon
    Given a garage with ID "GARAGE_ID"
    And there is a system error while generating the coupon
    When the administrator tries to generate a coupon for the garage with ID "GARAGE_ID"
    Then the system displays an error message indicating the coupon generation failed

  Scenario: Administrator assigns generated coupons to customers
    Given a generated coupon with code "COUPON_CODE"
    And there are eligible customers for the coupon
    When the administrator assigns the coupon with code "COUPON_CODE" to eligible customers
    Then the assigned customers can use the coupon code to avail the associated promotion or discount

  Scenario: Administrator tracks coupon usage
    Given a generated coupon with code "COUPON_CODE"
    When a customer uses the coupon code "COUPON_CODE" while availing the garage's services
    Then the system records the coupon usage
    And the administrator can view the usage statistics for the coupon

  Scenario: Administrator sets expiration dates for generated coupons
    Given a generated coupon with code "COUPON_CODE"
    And the coupon is associated with the garage with ID "GARAGE_ID"
    When the administrator sets an expiration date for the coupon with code "COUPON_CODE"
    Then the coupon becomes invalid for usage after the specified expiration date
    And the system prevents customers from using the expired coupon

  Scenario: Administrator modifies coupon details
    Given a generated coupon with code "COUPON_CODE"
    And the coupon is associated with the garage with ID "GARAGE_ID"
    When the administrator modifies the details of the coupon with code "COUPON_CODE"
    Then the updated details, such as the discount amount or offer description, are reflected for the coupon

  Scenario: Administrator deactivates a coupon
    Given a generated coupon with code "COUPON_CODE"
    And the coupon is associated with the garage with ID "GARAGE_ID"
    When the administrator deactivates the coupon with code "COUPON_CODE"
    Then the coupon becomes invalid and cannot be used by customers
    And the deactivated coupon is no longer visible or applicable for the associated promotion
