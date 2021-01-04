# Script to load our data into MongoDB via PyMongo"

# Import json and Mongo Client
import json
from pymongo import MongoClient


client = MongoClient('localhost', 27017) # Set up the client
db = client['StateCounty_DB'] # Create database
collection_counties = db['countiesGDP'] # Create collection for counties GDP
collection_states = db['statesGDP'] # Create collection for states GDP

# Load CountyGDP
with open('Final_countyGDP.json') as f: 
    county_data = json.load(f)

# Use insert_many to insert the documents
collection_counties.insert_many(county_data)
# Close the connection
client.close()

# Load StateGDP
with open('final_StateGDP.json') as f:
    state_data = json.load(f)
# Use insert_many to insert the documents
collection_states.insert_many(state_data)
# Close the connection
client.close()