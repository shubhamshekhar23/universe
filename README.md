About Project : 
There are multiple parallel universes. Each person in a universe has a identity `id` and a power. Power can be a positive or negative integer. All people are divided into families identified by `family_id`. A special creature from 4th dimension has been given a task to 
1. List families in a particular universe
2. Check if families with given family_id have same power in all universes. If powers don’t match then family_id is unbalanced
3. Find unbalanced family_ids
4. Balance given family_id
It provides the REST API to store the data of universes and to do the above tasks. 



Technology used : Nodejs and Mongodb
port used : 1234

Steps for starting the server - 
1. Run "npm install"
2. Start the mongodb server at port 27017 locally
3. Command to start the node server : "npm start"

Schema Creation - 
I have considered the possibility that There can be millions of parralel universes and each universe can have billions of people but in each family , there can not be a lot of members

All the test data to populate the database is inside TestData Folder.

Steps to populate the DB with the test data : 
1. Create Universes - 
    Use post http://localhost:1234/api/universe/add - It accepts an array of universes from TestData/universe.json (5 Universe data)
2. Create families and members - 
    Use post http://localhost:1234/api/family/add - It accepts an array of data from TestData/family.json ( 7 families and total 25 persons)
3. Create Powers for all the people in all the universe -
    Use get http://localhost:1234/api/createPowermapTestData - It creates a power.json inside TestData folder; which can be used for further below request; this randomly creates a power integer in the range(-100, 100)
    Use post http://localhost:1234/api/persons/power/add - it creates all the records in powermap collections with all the powers

Required API Listing - 
1. (API_1) List families in a particular universe - 
    e.g get request  - http://localhost:1234/api/getFamilies?universeId="5d0f56951361843044cc86fd"
2. (API_2) Check if families with given family_id have same power in all universes. If powers don’t match then family_id is unbalanced - 
    e.g GET request - http://localhost:1234/api/checkFamily?familyId="5d0f56ab1361843044cc8702"
3. (API_3) Find unbalanced family_ids - 
    e.g GET request - http://localhost:1234/api/findUnbalancedFamilies
4. (API_4) Balance given family_id - 
    Logic : Taking the average of the total power of that family in all the universes and then updating a single persons power accordingly to make the totalpower equal to average
    e.g POST request - http://localhost:1234/api/balanceFamily?familyId="5d0f56ab1361843044cc870e"

Testing The APIs - 
Note : As powers are randomly generated for the universes; its very unlikely that any family will be balanced; so First we can select any family id and then call the balance familyid API_4, and then we can test the API_2 and API_3.


