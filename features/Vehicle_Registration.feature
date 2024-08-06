Feature: Vehicle Registration
As a customer, I want to be able to provide necessary information about my vehicle during registration,
such as the make, model, year, and license plate number, so that it can be accurately represented in the system.

  As a customer
  I want to provide necessary information about my vehicle during registration
  So that it can be accurately represented in the system

  Scenario: Customer provides vehicle information during registration
    Given I am a customer
    When I navigate to the registration page
    And I enter the make of my vehicle as "Toyota"
    And I enter the model of my vehicle as "Camry"
    And I enter the year of my vehicle as "2020"
    And I enter the license plate number of my vehicle as "ABC123"
    And I click on the submit button
    Then my vehicle information should be accurately stored in the system

  Scenario: Customer provides complete vehicle information during registration
    Given I am a customer
    When I navigate to the registration page
    And I enter the make of my vehicle as "Honda"
    And I enter the model of my vehicle as "Civic"
    And I enter the year of my vehicle as "2019"
    And I enter the license plate number of my vehicle as "XYZ789"
    And I click on the submit button
    Then my vehicle information should be accurately stored in the system

  Scenario: Customer provides incomplete vehicle information during registration
    Given I am a customer
    When I navigate to the registration page
    And I enter the make of my vehicle as "Ford"
    And I enter the model of my vehicle as "Focus"
    And I click on the submit button
    Then I should see an error message indicating the missing information

  Scenario: Customer provides invalid license plate number during registration
    Given I am a customer
    When I navigate to the registration page
    And I enter the make of my vehicle as "Chevrolet"
    And I enter the model of my vehicle as "Malibu"
    And I enter the year of my vehicle as "2022"
    And I enter an invalid license plate number as "1234567"
    And I click on the submit button
    Then I should see an error message indicating the invalid license plate number

  Scenario: Customer updates vehicle information after registration
    Given I am a customer
    And I have already registered my vehicle
    When I navigate to the vehicle information page
    And I update the make of my vehicle to "BMW"
    And I click on the update button
    Then my updated vehicle information should be accurately stored in the system
