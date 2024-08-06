Feature: Membership Verification with OTP

Scenario: Successful Membership Verification
Given I am a customer
And I have requested membership verification
When I provide my email or phone number
And the system generates and sends an OTP to me
And I receive the OTP
And I enter the OTP into the system
Then the system should verify my membership
And confirm my identity
And allow me to proceed with my account activities

Scenario: Incorrect OTP Entry
Given I am a customer
And I have requested membership verification
When I provide my email or phone number
And the system generates and sends an OTP to me
And I receive the OTP
And I enter an incorrect OTP into the system
Then the system should display an error message indicating the incorrect OTP
And prevent me from proceeding with my account activities

Scenario: OTP Expiration
Given I am a customer
And I have requested membership verification
When I provide my email or phone number
And the system generates and sends an OTP to me
And I do not enter the OTP within the specified time limit
Then the system should display an error message indicating the expired OTP
And require me to request a new OTP for membership verification

Scenario: Resending OTP
Given I am a customer
And I have requested membership verification
When I provide my email or phone number
And the system generates and sends an OTP to me
And I do not receive the OTP or lose it
And I request the system to resend the OTP
Then the system should generate and send a new OTP to me
And I should receive the new OTP for membership verification
