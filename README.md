# hapi-token-docs
__Hapi, API boilerplate using tokens__

This web API was built to demonstrate some of the [hapi](hapijs.com) features and functionality. I often get asked
how to combine API user logon with token access and swagger documentation. The best answer I have found is to use
a very small amount of customisation for the swagger UI, this can easily be done with `hapi-swagger` plugin.

__Online Demo: https://hapi-token-docs.herokuapp.com/__

API has:
* Github based signin
* Cookie session for API users
* Token based access control to parts of the API
* Auto documentation with swagger UI
* Customised swagger layout
* Token automatically add to user request through swagger
* Redirects to https

The API is a simple calculator that allows you to add, subtract, divide or multiple two numbers without logging on. To demonstrate a more common set of API calls I also added methods to store sums into a mongodb database to do this you need to loggon and get a token.

Learn more about the JSON Web Tokens at https://jwt.io/




## Lab test
The project has a few unit tests. To run the test within the project type one of the following commands.
```bash
$ lab
$ lab -r html -o coverage.html
$ lab -r html -o coverage.html --lint
$ lab -r console -o stdout -r html -o coverage.html --lint
```

If you are considering sending a pull request please add tests for the functionality you add or change.


## Issues
If you find any issue please file here on github and I will try and fix them.