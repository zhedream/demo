async function* a() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

let b = a();

// console.log(b.next().then(console.log));
// console.log(b.next().then(console.log));
// b.return();
// console.log(b.next().then(console.log));
// console.log(b.next().then(console.log));

let c = new AbortController();
let s = c.signal;

(async () => {
  s.addEventListener("abort", () => {
    b.return();
  });

  setTimeout(() => {
    c.abort();
  }, 2000);

  let index = 0;

  for await (const v of b) {
    console.log("index", index);
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log(v);
        resolve(null);
      }, 1000);
    });
  }
})();
