## This file is being used temporarily to add quick features (might later migrate to a Changelog.md or some form of user story tracking third-party software)

### Note - No longer feasible to be working on branches in parallel. Branch out from frontend/features and merge back

### TODOs (merged TODOs from services-abstraction, add-tasks)

[X] Make it so services are interchangeable (mockserver or express) with no difference in how it is called - [ ] Make this better, compare with standard solutions - [ ] Why was it required to export an instance itself, is this done everytime?
[X] Refactor Services folder with all implementations of a particular services e.g taskServices with express, mock, ...etc implementation
[X] Get service type from .env file
[ ] Add unit tests only for testing services
[ ] Seperate out types for sending request vs parsing
[ ] Improve all work regarding Dates

- [ ] Improve and add validation to date field
- [ ] Improve the way date is displayed (should be as per localization, customer choosen format, etc.)
- [ ] Add validation for when to display date
- [x] Defaults to Today's date when no deadline date provided
- [ ] Improve logic for selecting date when no deadline date is provided
      [ ] Improve forms (validations, masking, change handlers)
- [ ] Use useReducer for form submission
- [ ] Showing error messages
      [ ] Improvement usage and organizaiton of types
- [ ] Read about --isolatedComponents exporting type error
- [ ] Explore standard practices
      [ ] Improve main view of tasks
- [ ] Read why you need to use `slice()` while returning a simple list!
- [ ] Add styles for showing tasks closer to deadline
- [ ] Add view for how far from deadline
      [ ] Improve Edit Task View
- [ ] Find better way to style when task marked completed
- [ ] Decide how to structure services for task marking completion
- [ ] On marking completion, update single task, no refresh for all tasks
      [ ] Improve Delete Task view - decide how much detail of the task to show
      [ ] Add tools with project scope that make it easier to develop (basic ones like prettier, eslint)
      [ ] Improve loading and error indicators overall
- [ ] Make error alerts dismissible
- [ ] Make error type more than just string
      [ ] Unit testing
      [ ] Move common code into a common components or utils folder!
      [ ] Tooltips
- [x] Add tooltip on buttons in main view
      [ ] Make it so services are interchangeable (mockserver or express) with no difference in how it is called
      [ ] Turn tasks into Card container - (this should be possible to easily revert)

### Take to backend

[ ] Improve overall website capabilities - [ ] Add marking task completed ability - [ ] Sub-tasks - [ ] Daily / Repeated tasks - [ ] Percentage completed - [ ] Individual sub-tasks can hold a percentage of overall task - [ ] Long running tasks
