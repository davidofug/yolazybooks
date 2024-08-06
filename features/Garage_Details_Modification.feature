Feature: Garage Details Modification
  As an administrator, I want to be able to modify the details of a garage, such as its name, 
  contact information, and address, so that accurate information is maintained in the system.

Scenario: Successful Garage Details Modification
Given I am an administrator
And there is an existing garage in the system
When I navigate to the garage details modification section
And I select the garage I want to modify
And I update the name, contact information, and address with valid information
And I submit the modification form
Then the system should update the garage details in the database
And display a confirmation message indicating successful modification
And reflect the updated details for the garage in the system

Scenario: Incomplete Garage Details Modification
Given I am an administrator
And there is an existing garage in the system
When I navigate to the garage details modification section
And I select the garage I want to modify
And I leave some of the required fields blank or provide invalid information
And I submit the modification form
Then the system should display appropriate error messages indicating the missing or invalid fields
And prevent the modification process until all required fields are correctly filled

Scenario: Garage Details Modification for Nonexistent Garage
Given I am an administrator
And there is no existing garage in the system
When I navigate to the garage details modification section
And I attempt to select a nonexistent garage
Then the system should display an error message indicating that the garage does not exist
And prevent any modification attempts for the nonexistent garage

Scenario: Garage Details Modification with Address Change
Given I am an administrator
And there is an existing garage in the system
When I navigate to the garage details modification section
And I select the garage I want to modify
And I update the address field with a new valid address
And I submit the modification form
Then the system should update the garage details, including the address, in the database
And display a confirmation message indicating successful modification
And reflect the updated address for the garage in the system
