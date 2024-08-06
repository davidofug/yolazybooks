Feature: Vehicle Registration
As a customer, I want to be able to register my vehicle in the system, so that I can associate it with my account and access relevant features and services.

Scenario: Successful Vehicle Registration**
Given I am a customer
When I navigate to the registration page
And I provide valid vehicle details
And I provide my account information
And I click on the "Register" button
Then I should receive a confirmation message
And my vehicle should be successfully registered in the system
And I should be able to access relevant features and services associated with my vehicle.

Scenario: Missing Vehicle Details**
Given I am a customer
When I navigate to the registration page
And I do not provide any vehicle details
And I provide my account information
And I click on the "Register" button
Then I should see an error message indicating that vehicle details are required
And my vehicle should not be registered in the system

Scenario: Missing Account Information**
Given I am a customer
When I navigate to the registration page
And I provide valid vehicle details
And I do not provide any account information
And I click on the "Register" button
Then I should see an error message indicating that account information is required
And my vehicle should not be registered in the system

Scenario: Invalid Vehicle Details**
Given I am a customer
When I navigate to the registration page
And I provide invalid vehicle details
And I provide my account information
And I click on the "Register" button
Then I should see an error message indicating that the provided vehicle details are invalid
And my vehicle should not be registered in the system

Scenario: Invalid Account Information**
Given I am a customer
When I navigate to the registration page
And I provide valid vehicle details
And I provide invalid account information
And I click on the "Register" button
Then I should see an error message indicating that the provided account information is invalid
And my vehicle should not be registered in the system

Scenario: Maximum Allowed Vehicles Reached**
Given I am a customer
And I have already registered the maximum number of vehicles allowed for my account
When I navigate to the registration page
And I provide valid vehicle details
And I provide my account information
And I click on the "Register" button
Then I should see an error message indicating that I have reached the maximum allowed vehicles
And my vehicle should not be registered in the system
