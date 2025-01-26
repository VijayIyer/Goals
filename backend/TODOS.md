[ ] Use best industry practices for sequelize, like a config file for using sequelize instance
    [ ] It should be possible to switch DB without making changes in code!!!
[ ] Convert to es6 syntax
[ ] Add routers for different endpoints
    [ ] Add auth router for user auth functionality to support multiple users
[ ] Add services for communicating with backend, instead of doing DB communication in controller itself
[ ] Update Task Model
    [ ] Add logic to make default deadline 1 day from when created
    [ ] Validation logic to prevent deadlines in the past 
    [X] Constraints on string properties like title and description so user cannot add unlimited characters!
    [X] Add deadline date property
    [X] Add backlogged / deferred property to indicate if task is deferred
[ ] Points Model for summarizing and keeping track of user's points on completed tasks!