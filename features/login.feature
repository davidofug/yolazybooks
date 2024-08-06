Feature: Login Page
  As a user
  I want to login to my account
  So that I can access the application

  Background:
    Given I am on the login page

  Scenario: Display the login form
    Then I should see the login form

  Scenario Outline: Validating required fields
    When I click the "Login" button without filling in any fields
    Then I should see error messages for both phone and password fields

    Examples:
      | field    |
      | phone    |
      | password |

  Scenario Outline: Validating field length
    When I enter a <field> with <length> characters
    And I click the "Login" button
    Then I should see an error message indicating it should be <errorLength> characters

    Examples:
      | field    | length | errorLength |
      | phone    | 9      | 10          |
      | password | 7      | 8           |

  Scenario: Toggling password visibility
    Given I have entered a password
    When I click on the eye next to hidden password
    Then the password should be revealed
    When I click the eye icon again
    Then the password should be hidden

  Scenario Outline: Toggling password visibility with initial state
    Given the password is <passwordVisibility>
    When I click the eye icon next to the password field
    Then the password should be <newPasswordVisibility>

    Examples:
      | passwordVisibility | newPasswordVisibility |
      | hidden             | revealed              |
      | revealed           | hidden                |




  Scenario: Submitting the form with valid input
    When I enter a valid phone number and password
    And I click the "Login" button
    Then the form should be submitted successfully
