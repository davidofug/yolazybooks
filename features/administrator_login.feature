Feature: Administrator Login
  As an administrator
  I want to be able to provide my phone number and password during login
  So that I can securely access the system and perform administrative tasks

Scenario: Logging in as an administrator with valid credentials
  Given I am on the login page
  When I enter my valid phone number and password
  And I click on the "Login" button
  Then I should be redirected to the administrator dashboard
  And I should be able to perform administrative tasks

Scenario: Logging in with an invalid phone number
  Given I am on the login page
  When I enter an invalid phone number
  And I enter my valid password
  And I click on the "Login" button
  Then I should see an error message indicating that the phone number is invalid
  And I should not be logged in
  
Scenario: Logging in with an incorrect password
  Given I am on the login page
  When I enter my valid phone number
  And I enter an incorrect password
  And I click on the "Login" button
  Then I should see an error message indicating that the password is incorrect
  And I should not be logged in
  
Scenario: Logging in with empty credentials
  Given I am on the login page
  When I leave both the phone number and password fields empty
  And I click on the "Login" button
  Then I should see error messages indicating that both the phone number and password are required
  And I should not be logged in

Scenario: Logging in with valid credentials but without administrator privileges
  Given I am on the login page
  When I enter my valid phone number and password
  And I click on the "Login" button
  Then I should see an error message indicating that I do not have administrator privileges
  And I should not be able to access the administrator dashboard
