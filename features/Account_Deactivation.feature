Feature: Account Deactivation
As an administrator, I want the ability to deactivate a customer's account, 
so that their access to the system and associated privileges are temporarily suspended.

Scenario: Successful Account Deactivation
Given I am an administrator
And there is an existing customer account in the system
When I navigate to the account deactivation section
And I select the customer account I want to deactivate
And I confirm the deactivation
Then the system should deactivate the customer's account
And suspend their access to the system and associated privileges
And display a confirmation message indicating successful account deactivation

Scenario: Account Deactivation for Nonexistent Account
Given I am an administrator
And there is no existing customer account in the system
When I navigate to the account deactivation section
And I attempt to select a nonexistent customer account
Then the system should display an error message indicating that the account does not exist
And prevent any deactivation attempts for the nonexistent account

Scenario: Reactivation of Deactivated Account
Given I am an administrator
And there is a deactivated customer account in the system
When I navigate to the account deactivation section
And I select the deactivated customer account I want to reactivate
And I confirm the reactivation
Then the system should reactivate the customer's account
And restore their access to the system and associated privileges
And display a confirmation message indicating successful account reactivation

Scenario: Account Deactivation with Pending Orders
Given I am an administrator
And there is an existing customer account in the system
And the customer has pending orders
When I navigate to the account deactivation section
And I select the customer account with pending orders
And I confirm the deactivation
Then the system should deactivate the customer's account
And suspend their access to the system and associated privileges
And display a confirmation message indicating successful account deactivation
And prevent the customer from placing new orders while their account is deactivated
