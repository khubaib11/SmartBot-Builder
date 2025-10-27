from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get MongoDB URL from .env
mongo_url = os.getenv("MONGO_URL")

# Connect to MongoDB Atlas
client = MongoClient(mongo_url)

# Create database and collection
db = client["vector_db"]              # creates automatically if not exist
collection = db["embeddings"]         # creates automatically if not exist

@app.route('/')
def home():
    return jsonify({"message": "MongoDB connected successfully!"})

@app.route('/create-sample')
def create_sample():
    sample_doc = {
        "text": "This is a sample document.",
        "vector": [0.1, 0.2, 0.3]     # example vector
    }
    collection.insert_one(sample_doc)
    return jsonify({"message": "Sample document inserted!"})

# use 5050 port

if __name__ == '__main__':
    app.run(debug=True,port=5050)
