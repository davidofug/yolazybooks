Feature: Garage Registration
  As an administrator, I want to be able to register a new garage in the system, so that I can add and manage information related to a specific garage or car repair shop. 

Scenario: Successful Garage Registration
Given I am an administrator
When I navigate to the garage registration section
And I fill out all the required fields with valid information
And I submit the registration form
Then the system should store the garage details in the database
And display a confirmation message indicating successful registration
And allow me to manage the registered garage information

Scenario: Incomplete Garage Registration
Given I am an administrator
When I navigate to the garage registration section
And I leave some of the required fields blank or provide invalid information
And I submit the registration form
Then the system should display appropriate error messages indicating the missing or invalid fields
And prevent the registration process until all required fields are correctly filled

Scenario: Duplicate Garage Registration
Given I am an administrator
And there is an existing garage with the same name or address in the system
When I navigate to the garage registration section
And I provide the same name or address for the new garage
And I submit the registration form
Then the system should display an error message indicating the duplication issue
And prevent the registration of a duplicate garage

Scenario: Garage Registration with Additional Services
Given I am an administrator
When I navigate to the garage registration section
And I provide all the required fields with valid information
And I add additional services offered by the garage
And I submit the registration form
Then the system should store the garage details along with the additional services in the database
And display a confirmation message indicating successful registration
