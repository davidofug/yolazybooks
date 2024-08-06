Feature: Reactivate Deactivated Garage

Scenario: Administrator successfully reactivates a deactivated garage
  Given a deactivated garage with ID "GARAGE_ID"
  When the administrator reactivates the garage with ID "GARAGE_ID"
  Then the garage with ID "GARAGE_ID" becomes visible to customers
  And the garage with ID "GARAGE_ID" resumes its operations

Scenario: Administrator tries to reactivate a non-existent garage
  Given there is no garage with ID "GARAGE_ID"
  When the administrator tries to reactivate the garage with ID "GARAGE_ID"
  Then the system displays an error message indicating the garage does not exist

Scenario: Administrator tries to reactivate an already active garage
  Given an active garage with ID "GARAGE_ID"
  When the administrator tries to reactivate the garage with ID "GARAGE_ID"
  Then the system displays a message indicating the garage is already active

Scenario: Administrator encounters an error while reactivating a garage
  Given a deactivated garage with ID "GARAGE_ID"
  And there is a system error during reactivation
  When the administrator tries to reactivate the garage with ID "GARAGE_ID"
  Then the system displays an error message indicating the reactivation failed

Scenario: Administrator reactivates a garage with pending maintenance
  Given a deactivated garage with ID "GARAGE_ID"
  And the garage with ID "GARAGE_ID" has pending maintenance tasks
  When the administrator reactivates the garage with ID "GARAGE_ID"
  Then the garage with ID "GARAGE_ID" becomes visible to customers
  And the garage with ID "GARAGE_ID" resumes its operations
  And the pending maintenance tasks are rescheduled or assigned to available staff members
