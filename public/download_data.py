import subprocess

subprocess.run(["pip", "install", "mysql-connector-python"])

import mysql.connector
import datetime  # 导入日期时间
import pandas as pd  # 将 pandas 导入为 pd

def download_data(url):
    """
    Downloads data from a MySQL API.

    Args:
        url: The URL of the MySQL API.

    Returns:
        Data in DataFrame format.
    """

    db = mysql.connector.connect(
        host="localhost",
        user="yourusername",
        password="yourpassword",
        database="yourdatabase"
    )

    cursor = db.cursor()

    query = "SELECT * FROM yourtable"

    cursor.execute(query)

    results = cursor.fetchall()

    cursor.close()
    db.close()

    df = pd.DataFrame(results)
    df["timestamp"] = datetime.datetime.now()

    return df

if __name__ == "main":
    url = "https://mirrors.volces.com/mysql/"
    df = download_data(url)
    print(df)