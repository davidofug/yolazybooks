Feature: Garage Deactivation
  As an administrator, I want the ability to deactivate a garage, 
  so that it is temporarily disabled and not visible to customers.

Scenario: Successful Garage Deactivation
Given I am an administrator
And there is an existing active garage in the system
When I navigate to the garage deactivation section
And I select the garage I want to deactivate
And I confirm the deactivation
Then the system should deactivate the garage
And disable its visibility to customers
And display a confirmation message indicating successful garage deactivation

Scenario: Garage Deactivation for Nonexistent Garage
Given I am an administrator
And there is no existing garage in the system
When I navigate to the garage deactivation section
And I attempt to select a nonexistent garage
Then the system should display an error message indicating that the garage does not exist
And prevent any deactivation attempts for the nonexistent garage

Scenario: Reactivation of Deactivated Garage
Given I am an administrator
And there is a deactivated garage in the system
When I navigate to the garage deactivation section
And I select the deactivated garage I want to reactivate
And I confirm the reactivation
Then the system should reactivate the garage
And enable its visibility to customers
And display a confirmation message indicating successful garage reactivation

Scenario: Garage Deactivation with Pending Repair Jobs
Given I am an administrator
And there is an existing garage in the system
And the garage has pending repair jobs
When I navigate to the garage deactivation section
And I select the garage with pending repair jobs
And I confirm the deactivation
Then the system should deactivate the garage
And disable its visibility to customers
And display a confirmation message indicating successful garage deactivation
And prevent new repair jobs from being assigned to the deactivated garage
