# TypeScript

接口: 规范, 标准

数据结构, 存储数据, 并有结构特性

数据结构,是根据需求设计出来的.

算法是操作数据接口的方法


枚举也是对象，因此使用 Obejct.keys/values 就行，
类型层面的话，可以 type K = keyof typeof UserType 拿到枚举 Key 的联合类型，
但是值类型的话就不行了，type V = UserType[keyof UserType] 会拿到枚举所有的属性与方法的类型（包括内置方法的）
