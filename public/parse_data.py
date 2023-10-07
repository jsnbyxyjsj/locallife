import pandas as pd

def analyze_data(df):
  """
  对数据进行分析和可视化。

  Args:
    df: 从 parse_data.py 解析后的数据。
  """

  # 按类别统计数据。

  df.groupby("category").count().plot(kind="bar")

  # 绘制目标值的直方图。

  df["target"].hist()

  # 计算数据的更新时间。

  df["update_time"] = time.time() - df["download_time"]

  # 按更新时间统计数据。

  df.groupby("update_time").count().plot(kind="line")

if __name__ == "__main__":
  df = analyze_data(df)
