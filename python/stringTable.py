import re 


str = """
{span:0$}|||时间：{fillError$age}
一|现场维护内容|正常{br}"√"|异常{br}"√"
|微站外部设备及周边环境||
1|微站周围环境变化情况、有无异常气味|{isTrue$PresenceOfAbnormalOdorsAroundTheMicrostation}|  {isFalse$PresenceOfAbnormalOdorsAroundTheMicrostation}
2|微站固定及检修通道是否通畅与安全|{isTrue$isOver20}|  {isFalse$isOver20}
审核人| {fill$name}|  日期| {fill$date}
"""


def parse_str_to_array_list(str):
    str = str.strip()
    # 按换行符分割
    lines = str.split('\n')
    # 分割每行并去掉前后空格
    array_list = [list(map(str.strip, line.split('|'))) for line in lines]
    # 去除空行
    array_list = [line for line in array_list if len(line) > 0]
    return array_list

# 数据
data = {
    'name': 'root',
    'date': '2020-10-10',
    'age': 18,
    'PresenceOfAbnormalOdorsAroundTheMicrostation': True,
    'isOver20': False,
}

# 处理函数
fns = {
    'br': lambda: '\n',
    'isTrue': lambda key: '√' if data.get(key) is True else '',
    'isFalse': lambda key: '√' if data.get(key) is False else '',
    'fill': lambda key: data.get(key),
}


array_list = parse_str_to_array_list(str)

# 解析每一列
for i, row in enumerate(array_list):
    for j, item_str in enumerate(row):
        matches = re.findall('{(.+?)}', item_str)
        for match in matches:
            #处理类型, 以及参数
            type, *args = match.split('$')
            if type in fns:
                array_list[i][j] = item_str.replace('{' + match + '}', fns[type](*args))

for line in array_list:
    print(line)
