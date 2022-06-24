// 不能是 async 异步函数
require(["../docx-templates"], (docxTemplates) => {
  console.log("docxTemplates: ", docxTemplates);

  const { createReport } = docxTemplates;
  const template = fetchFile("./input.docx");
  const doc = createReport({
    failFast: false,
    cmdDelimiter: ["{{", "}}"],
    template,
    additionalJsContext: {
      injectTable() {
        return "<div>table-html</div>";
      },
      isEven: (n) => n % 2 === 0,
    },
    data(q) {
      // 坑: 使用 函数写法, 在 word 中,必须使用 {{QUERY}}
      // 非函数, 则可以省略,{{QUERY}} 否则 ALIAS 不生效
      console.log(q);
      return {
        name: "world",
      };
    },
  });
  doc.then((doc) => {
    downloadBlob(
      doc,
      "output.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  });
});

// given url get an ArrayBuffer
async function fetchFile(url) {
  const template = await fetch(url);
  const templateBuffer = await template.arrayBuffer();
  return templateBuffer;
}
// read given file into an ArrayBuffer
async function readFile(fd) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(fd);
  });
}

// helper to download data as a file (like saveAs)
function downloadURL(data, fileName) {
  const a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = "display: none";
  a.click();
  a.remove();
}

function downloadBlob(data, fileName, mimeType) {
  const blob = new Blob([data], {
    type: mimeType,
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName, mimeType);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}
