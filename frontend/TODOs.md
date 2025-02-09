## This file is being used temporarily to add quick features (might later migrate to a Changelog.md or some form of user story tracking third-party software)

### TODOs
[X] Make it so services are interchangeable (mockserver or express) with no difference in how it is called
	- [ ] Make this better, compare with standard solutions
	- [ ] Why was it required to export an instance itself, is this done everytime?
[X] Refactor Services folder with all implementations of a particular services e.g taskServices with express, mock, ...etc implementation
[X] Get service type from .env file
[ ] Add unit tests only for testing services
[ ] Seperate out types for sending request vs parsing