Feature: Approve or Reject Garage Ratings

  Scenario: Administrator approves a customer rating for a garage
    Given a customer rating with ID "RATING_ID" for a garage with ID "GARAGE_ID"
    And the rating complies with the system guidelines
    When the administrator approves the customer rating with ID "RATING_ID" for the garage with ID "GARAGE_ID"
    Then the rating is marked as approved
    And the approved rating becomes visible to other users

  Scenario: Administrator rejects a customer rating for a garage
    Given a customer rating with ID "RATING_ID" for a garage with ID "GARAGE_ID"
    And the rating does not comply with the system guidelines
    When the administrator rejects the customer rating with ID "RATING_ID" for the garage with ID "GARAGE_ID"
    Then the rating is marked as rejected
    And the rejected rating is not visible to other users

  Scenario: Administrator encounters an error while approving or rejecting a rating
    Given a customer rating with ID "RATING_ID" for a garage with ID "GARAGE_ID"
    And there is a system error while processing the approval or rejection
    When the administrator tries to approve or reject the customer rating with ID "RATING_ID" for the garage with ID "GARAGE_ID"
    Then the system displays an error message indicating the approval or rejection process failed

  Scenario: Administrator reviews ratings for approval or rejection
    Given there are customer ratings available for the garage with ID "GARAGE_ID"
    When the administrator reviews the ratings for the garage with ID "GARAGE_ID"
    Then the administrator can assess each rating for compliance with the system guidelines
    And the administrator can approve or reject each rating accordingly

  Scenario: Administrator approves multiple ratings for a garage
    Given multiple customer ratings are pending approval for the garage with ID "GARAGE_ID"
    And all the ratings comply with the system guidelines
    When the administrator approves all the pending ratings for the garage with ID "GARAGE_ID"
    Then all the ratings are marked as approved
    And the approved ratings become visible to other users

  Scenario: Administrator rejects multiple ratings for a garage
    Given multiple customer ratings are pending approval for the garage with ID "GARAGE_ID"
    And some or all of the ratings do not comply with the system guidelines
    When the administrator rejects the non-compliant ratings for the garage with ID "GARAGE_ID"
    Then the non-compliant ratings are marked as rejected
    And the rejected ratings are not visible to other users
