Feature: User Sign Up
As a customer
I want to be able to sign up for the system
So that I can create an account and access the system

Scenario: Customer signs up with phone number and password
Given I am on the sign-up page
When I enter my phone number "1234567890"
And I set my password as "MyPassword123"
And I click the sign-up button
Then I should see a success message
And I should be redirected to the system dashboard
