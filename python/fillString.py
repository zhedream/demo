
# =========================
# ==========转化为数组===========
# =========================

# str = """
# {span:0$}|||时间：{fillError$age}
# 一|现场维护内容|正常{br}"√"|异常{br}"√"
# |微站外部设备及周边环境||
# 1|微站周围环境变化情况、有无异常气味|{isTrue$PresenceOfAbnormalOdorsAroundTheMicrostation}|  {isFalse$PresenceOfAbnormalOdorsAroundTheMicrostation}
# 2|微站固定及检修通道是否通畅与安全|{isTrue$isOver20}|  {isFalse$isOver20}
# 审核人| {fill$name}|  日期| {fill$date}
# """

# def parse_str_to_array_list(str):
#     # Split the string into lines
#     lines = str.strip().split("\n")
#     # Map over each line
#     return [line.split("|") for line in lines]

# array_list = parse_str_to_array_list(str)


# print(array_list)

# =========================
# ==========正则匹配===========
# =========================

# 数据
data = {
    "name": "root",
    "date": "2020-10-10",
    "age": "18",
    "isMan": True,
    "isDog": True,
}

# 处理函数
def br():
    return "<br>"

def fill(key):
    return data.get(key, "")

def isTrue(key):
    return "√" if data.get(key) is True else ""
def isFalse(key):
    return "√" if data.get(key) is False else ""

fns = {
    "br": br,
    "fill": fill,
    "isTrue": isTrue,
}

import re

str_ = "我是{fill$name}，{br}我今年{fill$age}岁了 {isTrue$isMan} , {isFalse$isDog}}"
pattern = r"\{(\S+?)\}+"
matches = re.findall(pattern, str_)

result = str_
for match in matches:
    type_, *args = match.split("$")
    if type_ in fns:
        result = result.replace("{" + match + "}", fns[type_](*args))

print(result)  # 我是root，<br>我今年18岁了
