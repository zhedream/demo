class Hello {
    name: string;
    constructor(name) {
        this.name = name;
    }
    get a() {
        return '1'
    }
}

let a = new Hello('dd');

console.log(a.a);


// 安装 deno , 可直接运行  deno deno.ts