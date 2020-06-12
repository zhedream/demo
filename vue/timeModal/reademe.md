# 时间多选弹框

根据传入的时间, 根据日期 分组进行选择

## 使用

```html
<time-modal
  v-model="showTimeModal"
  :times="timeAll"
  :defaultTimes="defaultTimes"
  @ok="($event)=>$emit('timeChange',$event)"
/>
```
v-model: 弹框显示隐藏
times: 所有的时间
defaultTimes: 默认选中的时间
@ok 确定的回调, 返回选中的时间

