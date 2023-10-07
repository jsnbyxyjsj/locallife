import subprocess

# 使用 pip freeze 命令生成 requirements.txt 文件
subprocess.run(['pip', 'freeze', '>', 'requirements.txt'], shell=True)
