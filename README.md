# CACHE

Cache, is a application designed for Indian parents and youth who want to securely invest their savings and earn profits from their invested savings with our unique feature called GOALS. Here, users can set up targets to save for something in some time period. This money saved in the goals, are invested by us in several funds according to our broad asset management, assuring a minimum of 12% p.a interest rate for the savings in goals and this money can be withdrawn anytime.Cache also provides seamless Banking like facilities which includes Creation of Account and Transfer of Funds. Along with all these, we also provide them with insurances, a lot of assured cashbacks and sponsored coupons on bill payments and recharges using our app. 

**Link to our App:** https://cache-fusion.herokuapp.com/

# How to start our application in your local

**Prerequisites:** Node.js, MongoDBl, A beautiful IDE

* Create a .env file 
* Add the following variable with their appropriate values to the .env file :
     <ul>
      <li>PORT </li>
     <li>MONGODB_URL</li>
      <li>SECRET_KEY</li>
     <li>FUSION_BASE_URL</li>
     <li>FUSION_AUTH_TOKEN</li>
     <li>FUSION_IFI_CODE</li>
   </ul><br>
* In app.js place your MongoDB URL
```
    uri: "<Replace with your MONGODB URL>",
    collection: 'sessions'
```
Open the dedicated Terminal of Your OS and Follow the Steps :
* Run ```npm ci```
* Run ```npm start```
* If everything is working fine, You will get a confirmation message that your application is running.

