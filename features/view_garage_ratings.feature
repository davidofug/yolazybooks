Feature: View Garage Ratings

Scenario: Administrator views ratings for a garage
  Given a garage with ID "GARAGE_ID"
  And there are customer ratings available for the garage with ID "GARAGE_ID"
  When the administrator requests to view the ratings for the garage with ID "GARAGE_ID"
  Then the system displays the ratings for the garage with ID "GARAGE_ID"

Scenario: Administrator views ratings for a garage with no ratings
  Given a garage with ID "GARAGE_ID"
  And there are no customer ratings available for the garage with ID "GARAGE_ID"
  When the administrator requests to view the ratings for the garage with ID "GARAGE_ID"
  Then the system displays a message indicating there are no ratings for the garage

Scenario: Administrator views ratings for a non-existent garage
  Given there is no garage with ID "GARAGE_ID"
  When the administrator requests to view the ratings for the garage with ID "GARAGE_ID"
  Then the system displays an error message indicating the garage does not exist

Scenario: Administrator encounters an error while viewing garage ratings
  Given a garage with ID "GARAGE_ID"
  And there is a system error while retrieving ratings
  When the administrator requests to view the ratings for the garage with ID "GARAGE_ID"
  Then the system displays an error message indicating the retrieval of ratings failed

Scenario: Administrator assesses garage performance based on ratings
  Given a garage with ID "GARAGE_ID"
  And there are customer ratings available for the garage with ID "GARAGE_ID"
  When the administrator views the ratings for the garage with ID "GARAGE_ID"
  Then the administrator can assess the performance of the garage based on the ratings

Scenario: Administrator compares ratings of multiple garages
  Given multiple garages exist
  And there are customer ratings available for each garage
  When the administrator requests to view the ratings for multiple garages
  Then the system displays the ratings for each garage
  And the administrator can compare the performance of the garages based on the ratings
