import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.impute import SimpleImputer
import pickle
import numpy as np

# Load the training and test datasets
X_train = pd.read_csv('X_train.csv')
X_test = pd.read_csv('X_test.csv')
y_train = pd.read_csv('y_train.csv').values.ravel()  # Convert to 1D array
y_test = pd.read_csv('y_test.csv').values.ravel()

# Handle missing values using SimpleImputer
imputer = SimpleImputer(strategy='mean')
X_train = imputer.fit_transform(X_train)
X_test = imputer.transform(X_test)

# Initialize models
models = {
    "Logistic Regression": LogisticRegression(random_state=42),
    "Random Forest": RandomForestClassifier(random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(random_state=42)
}

# Variable to keep track of the best model
best_model = None
best_accuracy = 0

# Train and evaluate models
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n{name} Model")
    print("Accuracy:", accuracy)
    print("Classification Report:\n", classification_report(y_test, y_pred))

    # Save the model with the best accuracy
    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model

# Save the best model to a file
with open('heart_disease_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

print(f"Best model saved with accuracy: {best_accuracy}")


# Load the trained model
with open('heart_disease_model.pkl', 'rb') as f:
    model = pickle.load(f)