from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
from werkzeug.utils import secure_filename
import tempfile
from pathlib import Path

from llama_index.llms.groq import Groq
from llama_index.core import VectorStoreIndex, Document
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.readers.file import PDFReader

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_url = os.getenv("MONGO_URL")
groq_api_key = os.getenv("GROQ_API_KEY")

if not mongo_url:
    raise ValueError("MONGO_URL not found in environment variables")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

client = MongoClient(mongo_url)
db = client["vector_db"]
organizations_collection = db["organizations"]
chat_history_collection = db["chat_history"]

llm = Groq(model="llama-3.3-70b-versatile", api_key=groq_api_key)
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

organization_indices = {}

@app.route('/')
def home():
    return jsonify({"message": "MongoDB connected successfully!"})

@app.route('/api/organizations', methods=['GET'])
def get_organizations():
    orgs = list(organizations_collection.find({}, {"_id": 0}))
    return jsonify(orgs)

@app.route('/api/create-bot', methods=['POST'])
def create_bot():
    try:
        mode = request.form.get('mode')
        bot_name = request.form.get('botName')
        bot_description = request.form.get('botDescription')

        if not bot_name or not bot_description:
            return jsonify({"error": "Bot name and description are required"}), 400

        org_id = f"org_{datetime.now().timestamp()}"

        if mode == 'automatic':
            if 'pdfFile' not in request.files:
                return jsonify({"error": "PDF file is required for automatic mode"}), 400

            pdf_file = request.files['pdfFile']

            if pdf_file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                pdf_file.save(tmp_file.name)
                tmp_path = tmp_file.name

            try:
                loader = PDFReader()
                documents = loader.load_data(file=Path(tmp_path))

                index = VectorStoreIndex.from_documents(
                    documents,
                    embed_model=embed_model
                )

                organization_indices[org_id] = index

                org_data = {
                    "id": org_id,
                    "name": bot_name,
                    "description": bot_description,
                    "mode": "automatic",
                    "pdf_name": secure_filename(pdf_file.filename),
                    "document_count": len(documents),
                    "created_at": datetime.now().isoformat(),
                    "location": "Global"
                }

                organizations_collection.insert_one(org_data.copy())

            finally:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)

        elif mode == 'manual':
            org_name = request.form.get('orgName')
            org_website = request.form.get('orgWebsite', '')
            org_industry = request.form.get('orgIndustry', '')
            org_about = request.form.get('orgAbout', '')

            import json
            employees = json.loads(request.form.get('employees', '[]'))
            products = json.loads(request.form.get('products', '[]'))
            services = json.loads(request.form.get('services', '[]'))

            if not org_name:
                return jsonify({"error": "Organization name is required"}), 400

            text_content = f"""
Organization Name: {org_name}
Website: {org_website}
Industry: {org_industry}
About: {org_about}

Employees:
"""
            for emp in employees:
                text_content += f"- {emp['name']}: {emp['role']}\n"

            text_content += "\nProducts:\n"
            for prod in products:
                text_content += f"- {prod['name']}: {prod['details']}\n"

            text_content += "\nServices:\n"
            for serv in services:
                text_content += f"- {serv['name']}: {serv['details']}\n"

            documents = [Document(text=text_content)]

            index = VectorStoreIndex.from_documents(
                documents,
                embed_model=embed_model
            )

            organization_indices[org_id] = index

            org_data = {
                "id": org_id,
                "name": bot_name,
                "description": bot_description,
                "mode": "manual",
                "organization": {
                    "name": org_name,
                    "website": org_website,
                    "industry": org_industry,
                    "about": org_about,
                    "employees": employees,
                    "products": products,
                    "services": services
                },
                "created_at": datetime.now().isoformat(),
                "location": "Global"
            }

            organizations_collection.insert_one(org_data.copy())

        else:
            return jsonify({"error": "Invalid mode"}), 400

        return jsonify({
            "message": "Chatbot created successfully!",
            "organization_id": org_id,
            "name": bot_name
        }), 201

    except Exception as e:
        print(f"Error creating bot: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/query/<org_id>', methods=['POST'])
def query_organization(org_id):
    try:
        data = request.get_json()
        query = data.get('query')

        if not query:
            return jsonify({"error": "Query is required"}), 400

        if org_id not in organization_indices:
            org = organizations_collection.find_one({"id": org_id}, {"_id": 0})
            if not org:
                return jsonify({"error": "Organization not found"}), 404

            return jsonify({"error": "Index not loaded. Please restart the server."}), 500

        index = organization_indices[org_id]
        query_engine = index.as_query_engine(llm=llm)
        response = query_engine.query(query)

        chat_entry = {
            "organization_id": org_id,
            "query": query,
            "response": str(response),
            "timestamp": datetime.now().isoformat()
        }
        chat_history_collection.insert_one(chat_entry)

        return jsonify({
            "response": str(response),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        print(f"Error querying: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat-history/<org_id>', methods=['GET'])
def get_chat_history(org_id):
    try:
        history = list(chat_history_collection.find(
            {"organization_id": org_id},
            {"_id": 0}
        ).sort("timestamp", -1).limit(50))

        return jsonify(history)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5050)
