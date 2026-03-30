Feature: Booking tickets on qamid.tmweb.ru

  Background:
    Given user is on the cinema home page

  Scenario: Happy Path - Buy a ticket to Stalker
    When user selects day "2"
    And user selects seance with id "217"
    And user selects single seat: row 2, chair 8
    And user clicks the booking button
    Then the ticket should contain seat "2/8"

  Scenario: Buy multiple tickets
  When user selects day "5"
  And user selects seance with id "225"
  And user selects multiple seats: "10/9, 5/6, 3/7"
  And user clicks the booking button
  Then the ticket should contain all seats: "10/9, 5/6, 3/7"

  Scenario: Sad Path - Try to book a reserved seat
    When user selects day "1"
    And user selects seance with id "217"
    And user selects a reserved seat
    Then the booking button should be disabled