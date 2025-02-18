# Some random app


## **How to make it work**

first run this command in your terminal after cloning
`npm i`

and set the env file as example below

`DATABASE_URL = 'postgresql://postgres:<username>@localhost:5432/<db-name>'
NEXTAUTH_SECRET=someRandomString
MAIL_CLIENT_ID= **google client id**
MAIL_RRFRESH_TOKEN=**(first make a oauth app and set the redirect url to https://developers.google.com/oauthplayground and enter your client id and secret and get the refresh token from there)**
MAIL_CLIENT_SECRET=**google client secret**`
JWT_ACCESS_TOKEN = "your_access_token_secret"
JWT_REFRESH_TOKEN = "your_refresh_token_secret"
EXPIRESIN_ACCESS_TOKEN = ""
EXPIRESIN_REFRESH_TOKEN = "" 
