import pandas as pd

# 读取csv文件
csv_file_path = './out-en.csv'
df = pd.read_csv(csv_file_path)

# 提示用户输入新列名
new_column_name = input("请输入新列名: ")

# 读取txt文件并解析分数
txt_file_path = 'en.txt'

scores_dict = {}
with open(txt_file_path, 'r', encoding='utf-8') as file:
    lines = file.readlines()
    for line in lines:
        score, names = line.strip().split(':')
        score = int(score)
        names_list = names.split('，')
        names_list = [name.rstrip('。') for name in names_list]  # 去掉姓名末尾的句号
        scores_dict[score] = names_list

# 为所有学生初始化新列分数为0
df[new_column_name] = 0

# 更新字典中的学生分数
for score, names in scores_dict.items():
    df.loc[df['name'].isin(names), new_column_name] = score

# 保存更新后的csv文件
df.to_csv(csv_file_path, index=False, mode='w', encoding='utf-8')

print(f"分数更新完成，并保存到原始文件中的新列 '{new_column_name}'")

