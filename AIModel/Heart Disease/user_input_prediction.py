import pickle
import numpy as np

# Function to collect user input for the prediction
def get_user_input():
    print("Please enter the following medical information:")

    age = int(input("Age: "))
    sex = int(input("Sex (1 = male, 0 = female): "))
    cp = int(input("Chest Pain Type (1 = typical angina, 2 = atypical angina, 3 = non-anginal pain, 4 = asymptomatic): "))
    trestbps = float(input("Resting Blood Pressure (mm Hg): "))
    chol = float(input("Cholesterol (mg/dl): "))
    fbs = int(input("Fasting Blood Sugar > 120 mg/dl (1 = true, 0 = false): "))
    restecg = int(input("Resting ECG Results (0 = normal, 1 = ST-T wave abnormality, 2 = left ventricular hypertrophy): "))
    thalach = float(input("Maximum Heart Rate Achieved: "))
    exang = int(input("Exercise-Induced Angina (1 = yes, 0 = no): "))
    # Comment out the following lines if your model does not require them
    # oldpeak = float(input("ST Depression Induced by Exercise Relative to Rest: "))
    # slope = int(input("Slope of the Peak Exercise ST Segment (0 = upsloping, 1 = flat, 2 = downsloping): "))
    # ca = int(input("Number of Major Vessels Colored by Fluoroscopy (0-3): "))
    # thal = int(input("Thalassemia (1 = normal, 2 = fixed defect, 3 = reversible defect): "))

    return np.array([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang]])

# Function to load the model and make predictions
def load_model_and_predict(input_features):
    # Load the trained model
    with open('heart_disease_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # Make a prediction
    prediction = model.predict(input_features)

    # Interpret the prediction
    prediction_map = {
        0: "No heart disease detected.",
        1: "Mild heart disease detected. Please consult a healthcare provider for further evaluation.",
        2: "Moderate heart disease detected. Medical consultation is recommended.",
        3: "Severe heart disease detected. Immediate medical attention is advised.",
        4: "Very severe heart disease detected. Urgent medical intervention is necessary."
    }

    return prediction[0], prediction_map[prediction[0]]

def main():
    # Get user input
    user_input = get_user_input()

    # Predict outcome
    prediction, message = load_model_and_predict(user_input)

    # Output the result
    print(f"\nPrediction: {prediction}")
    print(f"Message: {message}")

if __name__ == "__main__":
    main()
