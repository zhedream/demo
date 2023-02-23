// export {sum2} from "./sum2";
//
// export function hello() {
//   console.log("Hello from hello.js");
// }


const {sum2} = require("./sum2");
function hello() {
  console.log("Hello from hello.js");
}
module.exports = {hello, sum2};
// module.exports = {hello, sum2:function(){}};


