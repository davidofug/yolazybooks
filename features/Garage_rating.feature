Feature: Garage Rating
As a customer, I want to have the ability to rate a garage based on my experience, 
so that I can provide feedback to help other customers make informed decisions

  Scenario: Customer rates a garage based on their experience
    Given I am a customer
    And I have visited a garage
    When I have an experience with the garage
    Then I should be able to rate the garage
    And my rating should be saved for future reference
    And other customers should be able to view the rating
    
  Scenario: Customer rates a garage positively
    Given I am a customer
    And I have visited a garage
    When I have a positive experience with the garage
    And I want to rate the garage
    Then I should be able to give a high rating (e.g., 5 stars)
    And my rating should be saved for future reference
    And other customers should be able to view the high rating

  Scenario: Customer rates a garage negatively
    Given I am a customer
    And I have visited a garage
    When I have a negative experience with the garage
    And I want to rate the garage
    Then I should be able to give a low rating (e.g., 1 star)
    And my rating should be saved for future reference
    And other customers should be able to view the low rating

  Scenario: Customer updates their rating for a garage
    Given I am a customer
    And I have previously rated a garage
    And my rating is saved
    When I have a new experience with the garage
    And I want to update my rating
    Then I should be able to modify my previous rating
    And my updated rating should be saved for future reference
    And other customers should be able to view the updated rating

  Scenario: Customer views garage ratings
    Given I am a customer
    And I want to make an informed decision about a garage
    When I search for a specific garage
    Then I should be able to see the average rating of the garage
    And I should be able to view individual ratings and feedback from other customers

  Scenario: Customer rates a garage without visiting it
    Given I am a customer
    And I have not visited a specific garage
    When I want to rate the garage
    Then I should not be able to submit a rating without visiting the garage
    And I should receive a message or prompt to visit the garage before rating it

