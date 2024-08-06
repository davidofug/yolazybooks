Feature: Administrator Management
  As an administrator with permission to add administrators
  I want to be able to add new administrators to the system
  So that they can assist in managing user accounts and system settings

Scenario: Adding a new administrator to the system
  Given I am a logged-in administrator with permission to add administrators
  When I navigate to the administrator management section
  And I click on the "Add Administrator" button
  Then a form should be displayed to enter the new administrator's details
  
Scenario: Providing required details for adding a new administrator
  Given I am a logged-in administrator with permission to add administrators
  When I enter the new administrator's name, email, and role in the form
  And I click on the "Save" button
  Then the system should validate the provided details
  And a confirmation message should be displayed
  
Scenario: Adding a new administrator with invalid details
  Given I am a logged-in administrator with permission to add administrators
  When I enter invalid or incomplete details for the new administrator
  And I click on the "Save" button
  Then the system should display appropriate error messages
  And prevent the new administrator from being added
  
Scenario: Adding a new administrator successfully
  Given I am a logged-in administrator with permission to add administrators
  When I enter valid details for the new administrator
  And I click on the "Save" button
  Then the system should save the new administrator's information
  And display a success message
  And the new administrator should be added to the system
  
Scenario: Adding a new administrator without permission
  Given I am a logged-in administrator without permission to add administrators
  When I navigate to the administrator management section
  Then I should not see the "Add Administrator" button
  And I should not have access to the functionality to add new administrators
