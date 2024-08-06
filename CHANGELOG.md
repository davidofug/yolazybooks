# Change log

This change log provides a summary of the updates and enhancements made to the Autofore Web Application.

## [0.0.1] (MVP)- 2023-08-02
### Customer Dashboard UI
#### Added
- Initial customer dashboard.
- Responsive design for seamless mobile experience.
- Filtering options for the vehicle list for garages

#### Fixed
- Improved responsive design on smaller screens.
- Appointment UI 
- Profile update bug

### Vehicle Page
#### Added
- Detailed vehicle information and status.
- Add vehicle functionality
- Alert message UI for api requests
- Delete and update vehicles.

#### Changed
- Enhanced the user interface for vehicle details.
- Updated error handling for vehicle-related actions.

#### Fixed
- Fixed bugs related to vehicle data retrieval.
- Addressed issues with vehicle status updates.
- Resolved search and filter-related problems.
- Improved error reporting for vehicle-related actions.
- Fixed appwrite errors (vehicles not saving)

### Vehicle Adding Form
#### Added
- Vehicle adding form with relevant fields.
- Validation and error feedback for form inputs.
- Integration with Appwrite for data persistence.
- Confirmation messages upon successful vehicle addition.

#### Changed
- Improved error handling during form submission.
- Added a missing field that is necessary for the vehicle information

#### Fixed
- Addressed issues related to form submission.
- Fixed bugs in the form validation logic.
- Resolved data persistence problems with Appwrite.
- Improved the clarity of error messages.

### Appwrite Database Integration
#### Added
- Integrated Appwrite for data storage and retrieval.
- Configured database collections for vehicle data.
- Implemented data synchronization between the frontend and Appwrite backend.

#### Changed
- Updated vehicle modal to match Appwrite collections.

### Authentication Workflow
#### Added
- Feat: Signing up with phone number and otp only.
- Feat: Logging in using phone number and otp only.
- Feat: Signing up using phone number and password.
- Feat: Logging in using phone number and password.

#### Changed
- Feat: Signing up with phone number and otp only
- Feat: Logging in with phone number and otp only

#### Fixed
- Bugfix: Checking if the user exists before sending them a verification code

### Garages
#### Added
- Feat: Adding garages
- Feat: Admin listing garages
- Feat: Admin filtering garages by name, date range, and status
- Feat: Admin viewing the garage details
- Feat: Alerts on the status of the appwrite api calls for a better user experience.
- Feat: Admin can delete a garage

#### Changed
- Refactor: Adding garages. Removed the leverage of the admin entering their own services while adding the garage services.
- Refactor: Loading state listing garages 

#### Fixed


### Vehicle Dashboard
#### Added
- Feat: fetching data admin dashboard

#### Changed
- Refactor: statistics cards, ratings widget and the ratings chart. Removed the dummy data.

#### Fixed
- Feat: Displaying the actual statistics on the statistis cards, ratings widgets and ratings chart.



### Landing page
#### Added
- Feat: Listing garages.
- Feat: Filtering garages by services and location.
- Feat: Listing nearby garages based on the users location and placing them on the map.
- Feat: Giving directions on selecting a garage on the map.

#### Changed
- Refactor: Adding garages. Removed the leverage of the admin entering their own services while adding the garage services.
- Refactor: Loading state listing garages. 

#### Fixed
- Fix: Responsiveness especially on smaller screens.

### Listing Vehicles
#### Added
- Feat: Admin listing vehicles

### Listing Appointments
#### Added
- Feat: Admin listing appointments





