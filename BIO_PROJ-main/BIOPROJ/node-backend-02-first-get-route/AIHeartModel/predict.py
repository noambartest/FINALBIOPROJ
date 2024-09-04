import pickle
import sys
import json
import numpy as np
import os

# Load the model using an absolute path
model_path = os.path.join(os.path.dirname(__file__), 'heart_disease_model.pkl')

with open(model_path, 'rb') as f:
    model = pickle.load(f)

def predict(features):
    # Prepare features for prediction
    features_list = [
        features['age'],
        features['sex'],
        features['cp'],
        features['trestbps'],
        features['chol'],
        features['fbs'],
        features['restecg'],
        features['thalach'],
        features['exang']
    ]
    
    # Convert list to numpy array
    features_array = np.array([features_list])
    
    # Make prediction
    prediction = model.predict(features_array)
    return prediction[0]

if __name__ == "__main__":
    try:
        # Get input features from command line arguments
        input_features = json.loads(sys.argv[1])
        result = predict(input_features)
        print(result)  # This will be captured by Node.js
    except Exception as e:
        print(f"Error during prediction: {e}")