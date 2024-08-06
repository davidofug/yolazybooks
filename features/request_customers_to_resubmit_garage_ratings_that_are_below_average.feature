Feature: Request Customers to Resubmit Ratings for Below Average Garage

  Scenario: Administrator requests a customer to resubmit a garage's rating if it is below average.
    Given a customer rating with ID "RATING_ID" for a garage with ID "GARAGE_ID"
    And the rating provided by the customer is below average
    When the administrator requests the customer to resubmit the rating for the garage with ID "GARAGE_ID"
    Then the customer receives a notification or email requesting them to reconsider their rating
    And the customer is provided with information about improvements made by the garage

  Scenario: Administrator encounters an error while requesting a customer to resubmit a rating
    Given a customer rating with ID "RATING_ID" for a garage with ID "GARAGE_ID"
    And there is a system error while sending the request
    When the administrator tries to request the customer to resubmit the rating for the garage with ID "GARAGE_ID"
    Then the system displays an error message indicating the request failed

  Scenario: Administrator reviews below average ratings for requesting resubmission
    Given there are customer ratings available for the garage with ID "GARAGE_ID"
    And some of the ratings are below average
    When the administrator reviews the ratings for the garage with ID "GARAGE_ID"
    Then the administrator can identify the below average ratings
    And the administrator can select specific ratings to request resubmission

  Scenario: Administrator tracks resubmission requests
    Given a customer has been requested to resubmit a rating for the garage with ID "GARAGE_ID"
    When the customer resubmits the rating
    Then the system records the resubmission
    And the administrator can view the updated rating provided by the customer

  Scenario: Administrator provides guidance for resubmission
    Given a customer has been requested to resubmit a rating for the garage with ID "GARAGE_ID"
    When the customer receives the request for resubmission
    Then the request includes guidance or instructions for reconsidering their rating
    And the guidance highlights improvements made by the garage since their previous rating
