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

## Trying out the demo on your local computer
You need have git, node.js and mongodb install on your computer and github account

1. From a commandline run `$ git clone https://github.com/glennjones/hapi-token-docs.git`
2. Move into the project directory `$ cd hapi-token-docs`
3. Logon to Github and go to https://github.com/settings/developers
4. Click the "Register new application" use "http://localhost:3033" two url fields
5. Once created make a note of the "Client ID" and "Client Secret"
6. Create a new file called `.env` this will store our environment variables
7. Within the `.env` file add the following lines text changing the values
```
PRIVATEKEY=some-text
COOKIE_PASSWORD=some-text-more-than-32-chars
GITHUB_PASSWORD=some-text-more-than-32-chars
GITHUB_CLIENTID=client-id-you-just-got-from-github
GITHUB_CLIENTSECRET=client-secret-you-just-got-from-github
ISSUCURE=false
```
8. Run `$ npm install`
9. Start the mongodb server `$ mongod`
10. Run `$ node app`
11. Connect to the server using `http://localhost:3033`

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