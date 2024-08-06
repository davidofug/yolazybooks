Feature: Administrator Password Reset
  As an administrator
  I want to be able to reset my own password
  So that I can regain access to my account if I forget or need to change my password

Scenario: Resetting password with a valid email
  Given I am on the password reset page
  When I enter my valid email address
  And I click on the "Reset Password" button
  And I receive a password reset link via email
  And I click on the password reset link
  And I enter a new password and confirm it
  And I click on the "Save" button
  Then I should see a success message indicating that my password has been reset
  And I should be able to log in with the new password

Scenario: Resetting password with an invalid email
  Given I am on the password reset page
  When I enter an invalid email address
  And I click on the "Reset Password" button
  Then I should see an error message indicating that the email is invalid
  And I should not receive a password reset link via email
  And I should not be able to log in with the old or new password

Scenario: Resetting password with an expired password reset link
  Given I have requested a password reset
  And the password reset link has expired
  When I click on the expired password reset link
  Then I should see an error message indicating that the link has expired
  And I should not be able to reset my password

Scenario: Resetting password without entering a new password
  Given I am on the password reset page
  When I enter my valid email address
  And I click on the "Reset Password" button
  And I receive a password reset link via email
  And I click on the password reset link
  And I leave the new password and confirmation fields empty
  And I click on the "Save" button
  Then I should see an error message indicating that a new password is required
  And I should not be able to log in with the old or new password
