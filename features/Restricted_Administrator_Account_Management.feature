Feature: Restricted Administrator Account Management
  As an administrator without permission to add other administrators
  I want to be restricted from adding new administrators
  So that only authorized personnel can manage administrator accounts

Scenario: Attempting to add a new administrator without permission
  Given I am a logged-in administrator without permission to add other administrators
  When I navigate to the administrator management section
  Then I should not see the "Add Administrator" button
  And I should not have access to the functionality to add new administrators
  
Scenario: Viewing existing administrators without permission to add
  Given I am a logged-in administrator without permission to add other administrators
  When I navigate to the administrator management section
  Then I should be able to view the list of existing administrators
  And I should not have the option to add or modify any administrators

Scenario: Requesting permission to add new administrators
  Given I am a logged-in administrator without permission to add other administrators
  When I contact the authorized personnel or administrator with permission
  And I request permission to add new administrators
  Then I should receive information on how to obtain the required permission
  And I should not be able to add new administrators until permission is granted
  
Scenario: Attempting to add a new administrator after permission is granted
  Given I am a logged-in administrator without permission to add other administrators
  And I have obtained permission from the authorized personnel
  When I navigate to the administrator management section
  Then I should see the "Add Administrator" button
  And I should have access to the functionality to add new administrators
