import requests
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.linear_model import LinearRegression
import tensorflow as tf
import sqlite3
from datetime import datetime
import os
import json

def load_data(url):
  response = requests.get(url)
  df = pd.read_json(response.text)
  return df

def explore_data(df):
  plt.plot(df["x"], df["y"])
  plt.title("Data Visualization")
  plt.xlabel("x")  
  plt.ylabel("y")
  plt.show()
  
def preprocess_data(df):
  X = df[["x"]]
  y = df["y"]
  return X, y

def train_model(X, y):
  lr = LinearRegression().fit(X, y)
  return lr

def predict(model, X):
  return model.predict(X)

def evaluate_model(model, X, y):
  predictions = predict(model, X)
  mse = np.mean((predictions - y)**2)
  r_squared = model.score(X, y)
  print("MSE:", mse)
  print("R-squared:", r_squared)

def save_predictions(predictions, filename):
  with open(filename, "w") as f:
    for prediction in predictions:
      f.write(str(prediction) + "\n")

def save_model(model, filename):
  model.save(filename)

def load_model(filename):
  return tf.keras.models.load_model(filename)

def main():
  url = "https://example.com/data.json"
  df = load_data(url)
  explore_data(df)
  X, y = preprocess_data(df)
  model = train_model(X, y)
  evaluate_model(model, X, y)
  predictions = predict(model, X)
  save_predictions(predictions, "predictions.txt")
  save_model(model, "model.h5")

if __name__ == "__main__":
  main()
