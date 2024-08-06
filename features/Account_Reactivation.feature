Feature: Account Reactivation
  As an administrator, I want the ability to reactivate a customer's account, 
  so that they can regain access to the system and resume their activities.

Scenario: Successful Account Reactivation
Given I am an administrator
And there is an existing deactivated customer account in the system
When I navigate to the account reactivation section
And I select the customer account I want to reactivate
And I confirm the reactivation
Then the system should reactivate the customer's account
And restore their access to the system and associated privileges
And display a confirmation message indicating successful account reactivation

Scenario: Account Reactivation for Active Account
Given I am an administrator
And there is an existing active customer account in the system
When I navigate to the account reactivation section
And I attempt to select an active customer account
Then the system should display an error message indicating that the account is already active
And prevent any reactivation attempts for the active account

Scenario: Reactivation of Nonexistent Account
Given I am an administrator
And there is no existing customer account in the system
When I navigate to the account reactivation section
And I attempt to select a nonexistent customer account
Then the system should display an error message indicating that the account does not exist
And prevent any reactivation attempts for the nonexistent account

Scenario: Account Reactivation with Pending Orders
Given I am an administrator
And there is an existing deactivated customer account in the system
And the customer has pending orders
When I navigate to the account reactivation section
And I select the customer account with pending orders
And I confirm the reactivation
Then the system should reactivate the customer's account
And restore their access to the system and associated privileges
And display a confirmation message indicating successful account reactivation
And allow the customer to proceed with their pending orders
