Feature: Customer Referral

As a customer, I want to be able to refer other customers to the system,
so that they can also benefit from the services and features offered.

Scenario: Customer refers another customer successfully
  Given a customer is registered and logged in
  When the customer navigates to the referral section
  And enters the email address of another customer
  And submits the referral form
  Then the system should send an email invitation to the referred customer
  And track the referral in the system

Scenario: Customer attempts to refer themselves
  Given a customer is registered and logged in
  When the customer navigates to the referral section
  And enters their own email address
  And submits the referral form
  Then the system should display an error message stating self-referral is not allowed

Scenario: Customer refers an invalid email address
  Given a customer is registered and logged in
  When the customer navigates to the referral section
  And enters an invalid email address
  And submits the referral form
  Then the system should display an error message stating the email address is invalid

Scenario: Customer refers a customer who is already registered
  Given a customer is registered and logged in
  When the customer navigates to the referral section
  And enters the email address of an already registered customer
  And submits the referral form
  Then the system should display an error message stating the referred customer is already registered

Scenario: Referred customer signs up using the referral link
  Given a customer receives a referral invitation email
  When the customer clicks on the referral link
  And signs up for the system
  Then the system should track the referral as successful
  And credit both the referring customer and the referred customer with a reward

Scenario: Referred customer signs up without using the referral link
  Given a customer receives a referral invitation email
  When the customer signs up for the system without using the referral link
  Then the system should not track the referral as successful
  And not credit any rewards to either the referring customer or the referred customer
