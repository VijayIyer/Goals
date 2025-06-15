## This file is being used temporarily to add quick features (might later migrate to a Changelog.md or some form of user story tracking third-party software)

### Note - No longer feasible to be working on branches in parallel. Branch out from frontend/features and merge back

### TODOs

#### Use cases

[X] Ability to add priority to tasks
[ ] Ability to add one or more tags to tasks
[ ] Ability to sort tasks by deadline date, priority
[ ] Ability to filter tasks by date, tag

- [x] By date
- [ ] By tag
- ~~[ ] There should be a calendar view - overview of tasks by month, week, year~~

May 26, 2025

[ ] Date filter using date / week / month / year / custom date range

- [x] Day
- [x] Week
- [x] Month
- [x] Year
- [ ] Week view showing wrong start and end date
- [ ] Week date range format is hardcoded - should be user input or date method

[ ] Seperate view for backlogged / deferred tasks

[ ] When backlogged / deferred task is marked as no longer backlogged, prompt user for date with current viewing date as the default

[ ] Task Description field should be rich-text

[ ] Give warning message when user tries to mark a task in the future as completed!

[ ] Helper tooltips near every field

May 26, 2025

- [ ] When custom date range is selected, add tooltip showing reason why Prev, Next are disabled

### Tech-Debt

[X] Make it so services are interchangeable (mockserver or express) with no difference in how it is called

- [ ] Make this better, compare with standard solutions
- [ ] Why was it required to export an instance itself, is this done everytime?

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
      [ ] Improvement usage and organization of types
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
- [ ] Turn tasks into Card container - (this should be possible to easily revert)
- [ ] Does priority in AddTaskModal need to get a default value?
- [ ] Does backlogged tasks really need a new path itself??
- [ ] Does Calendar view need to be a separate path or within Tasks?

May 26, 2025

[ ] Update logic for auto-selecting end date when filter group is changed to week

[ ] Update logic and method for displaying all weeks in a year in SelectDateRangeModal (should it even be a select field)

[ ] Update logic for displaying month names in a select field (should it even be a Select field?)

[ ] Instead of DateRange composed of week, month, year, should there only be a start and end date? the rest can be derived from one of these

[ ] Create an HOC that will add disabled styling to any component - e.g buttons disabled, text grayed out, tooltips indicating disabled

June 8, 2025

[ ] Bug - date filter selection not being retained

- [ ] Use useSearchParams?

June 11, 2025
Use case
[ ] Highlight the active path using react router dom!

June 15, 2025
[X] Bug - when dateRange filter is day, no tasks are showing up!!
[X] Collapse all commits - time to get more optimal -> completed with git reset --soft commands
