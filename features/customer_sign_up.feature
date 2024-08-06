Feature: Customer Sign Up
  As a customer
  I want to be able to sign up for the system
  So that I can create an account and access the system

  Scenario: Customer signs up successfully with valid phone number and password
    Given I am on the sign-up page
    When I enter a valid phone number
    And I set a valid password
    And I click the "Sign Up" button
    Then I should be redirected to the system dashboard
    And I should see a success message indicating that my account has been created

  Scenario: Customer cannot sign up with an invalid phone number
    Given I am on the sign-up page
    When I enter an invalid phone number
    And I set a valid password
    And I click the "Sign Up" button
    Then I should see an error message indicating that the phone number is invalid

  Scenario: Customer cannot sign up without setting a password
    Given I am on the sign-up page
    When I enter a valid phone number
    And I leave the password field blank
    And I click the "Sign Up" button
    Then I should see an error message indicating that a password is required

  Scenario: Customer cannot sign up with a weak password
    Given I am on the sign-up page
    When I enter a valid phone number
    And I set a weak password
    And I click the "Sign Up" button
    Then I should see an error message indicating that the password is too weak

  Scenario: Customer cannot sign up if the phone number is already registered
    Given I am on the sign-up page
    When I enter a phone number that is already registered in the system
    And I set a valid password
    And I click the "Sign Up" button
    Then I should see an error message indicating that the phone number is already taken
