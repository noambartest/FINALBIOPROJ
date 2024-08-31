import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load the data
data = pd.read_csv('heart.csv')  # Ensure your dataset is in the same directory or provide the full path

# Check for missing values
print(data.isnull().sum())

# Identify non-numeric columns
print(data.dtypes)

# Convert non-numeric columns to numeric if possible
# This assumes non-numeric columns are supposed to be numeric but stored as strings
for col in data.columns:
    if data[col].dtype == 'object':
        data[col] = pd.to_numeric(data[col], errors='coerce')

# Check again for data types and missing values after conversion
print(data.dtypes)
print(data.isnull().sum())

# Select features and target
features = data.drop('num', axis=1)  # Assuming 'num' is the target variable
target = data['num']

# Handle missing values (fill or drop)
features = features.fillna(features.mean())  # Fill missing values with column mean

# Normalize/standardize the features
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(features_scaled, target, test_size=0.2, random_state=42)

# Save the processed data if needed
pd.DataFrame(X_train).to_csv('X_train.csv', index=False)
pd.DataFrame(X_test).to_csv('X_test.csv', index=False)
pd.DataFrame(y_train).to_csv('y_train.csv', index=False)
pd.DataFrame(y_test).to_csv('y_test.csv', index=False)