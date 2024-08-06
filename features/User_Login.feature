Feature: User Login
  As a customer
  I want to be able to log in to the system
  So that I can access my account and perform various tasks

  Scenario: Customer logs in with phone number and OTP
    Given I am on the login page
    When I enter my phone number "1234567890"
    And I request to receive an OTP
    Then a unique OTP should be sent to my phone number
    And I should see a message indicating that the OTP has been sent
    When I enter the OTP "123456"
    And I click the login button
    Then I should be redirected to the system dashboard
    And I should see a welcome message confirming my successful login
