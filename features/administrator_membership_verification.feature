Feature: Administrator Membership Verification
  As an administrator
  I want to verify my membership by receiving an OTP via SMS
  So that I can ensure the security of my account and prevent unauthorized access

Scenario: Verifying membership with a valid OTP
  Given I am on the membership verification page
  When I enter my valid phone number
  And I click on the "Send OTP" button
  And I receive an OTP via SMS
  And I enter the valid OTP in the verification field
  And I click on the "Verify" button
  Then I should see a success message indicating that my membership is verified
  And I should be able to access the administrative functionalities

Scenario: Verifying membership with an invalid OTP
  Given I am on the membership verification page
  When I enter my valid phone number
  And I click on the "Send OTP" button
  And I receive an OTP via SMS
  And I enter an incorrect OTP in the verification field
  And I click on the "Verify" button
  Then I should see an error message indicating that the OTP is incorrect
  And I should not be able to access the administrative functionalities

Scenario: Verifying membership without receiving an OTP
  Given I am on the membership verification page
  When I enter my valid phone number
  And I click on the "Send OTP" button
  And I do not receive any OTP via SMS
  Then I should see an error message indicating that the OTP could not be sent
  And I should not be able to access the administrative functionalities
