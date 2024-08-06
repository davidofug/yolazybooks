Feature: Membership Verification
As a customer
I want to verify my membership
So that I can ensure the security of my account and confirm my identity

Scenario: Customer verifies membership with OTP
Given I am on the membership verification page
And I have provided my phone number "1234567890" for sign-up
When I request to receive an OTP
Then a unique OTP should be sent to my phone number
And I should see a message indicating that the OTP has been sent
When I enter the OTP "123456"
And I click the verify button
Then I should see a success message confirming my membership verification
And I should be redirected to the system dashboard
