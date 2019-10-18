class Stack {
    items = [];//保存栈内元素的数组
    top = 0;//栈顶元素的位置
    push(element) {
        this.items[this.top++] = element;
    }
    pop() {//出栈
        return this.items[--this.top];
    }
    length() {//当返回0是说明栈是空栈
        return this.top;
    }
    clear() {//移除栈的所有元素
        this.top = 0;
    }
    get() {
        return this.items;
    }
    log() {
        console.log(this.items);

    }
}

class Stack2 {
    items = [];//保存栈内元素的数组
    push(element) {
        this.items.push(element)
    }
    pop() {//出栈
        return this.items.pop();
    }
    length() {//当返回0是说明栈是空栈
        return this.items.length;
    }
    clear() {//移除栈的所有元素
        this.items.length = 0;
    }
    get() {
        return this.items;
    }
    log() {
        console.log(this.items);
    }
    test() {
        this.items.length = 4
    }
}

let a = new Stack2();



