import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('./out-ma.csv', index_col=0)

# 显示当前的 DataFrame
print("当前表格:")
print(df)

# 提示用户添加列名
new_column = input("请输入新列名: ")

# 添加新列并提示输入成绩
df[new_column] = 0  # 初始化新列为0

# 提示用户输入每个学生的成绩
for name in df.index:
    while True:
        try:
            score = int(input(f"请输入{name}在{new_column}中的成绩: "))
            if 0 <= score <= 150:
                df.loc[name, new_column] = score
                break
            else:
                print("成绩应在0到150之间，请重新输入。")
        except ValueError:
            print("请输入有效的整数成绩。")

# 显示更新后的 DataFrame
print("\n更新后的表格:")
print(df)

# 保存更新后的 DataFrame
df.to_csv('out-ma.csv', encoding='utf-8-sig')
print("数据已保存到 'out-ma.csv'")

