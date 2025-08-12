import pandas as pd
import json

# 读取CSV文件
df = pd.read_csv('./out-ma.csv')

# 获取列名
columns = df.columns
name_column = columns[0]
score_columns = columns[1:]

# 创建新的DataFrame用于存放归类后的数据
new_df = pd.DataFrame()
new_df[name_column] = df[name_column]

# 计算每列的排名，并将分数和排名归为一类
for col in score_columns:
    ranking_col = f'{col}排名'
    df[ranking_col] = df[col].rank(ascending=False, method='min').astype(int)
    new_df[col] = df.apply(lambda row: {'分数': row[col], '排名': row[ranking_col]}, axis=1)

# 计算总分
df['总分'] = df[score_columns].sum(axis=1)

# 计算总分排名
df['总分排名'] = df['总分'].rank(ascending=False, method='min').astype(int)

# 根据总分排名排序
df = df.sort_values(by='总分', ascending=False)

# 将排序后的姓名列和归类的分数排名数据合并到新的DataFrame
sorted_new_df = new_df.loc[df.index]

# 将总分和总分排名也归为一类并添加到新DataFrame
sorted_new_df['总分'] = df.apply(lambda row: {'分数': row['总分'], '排名': row['总分排名']}, axis=1)

# 转换为JSON
json_data = sorted_new_df.to_json(orient='records', force_ascii=False)

# 将JSON数据写入文件
with open('ma.json', 'w', encoding='utf-8') as f:
    f.write(json_data)

print("数据已保存到 'ma.json'")

