# 用于模板导出

https://github.com/guigrpa/docx-templates

打包浏览器版本: docx-templates.js

pnpm i

pnpm run build

使用

```html
<script src="docx-templates.js"></script>

<script>
  async function exportWord() {
    const { createReport } = docxTemplates;

    const template = await getTemplate();

    const doc = await createReport({
      failFast: false,
      cmdDelimiter: ["{{", "}}"],
      template,
      data: (q) => {
        // 坑: 使用 函数写法, 在 word 中,必须使用 {{QUERY}}
        // 非函数, 则可以省略,{{QUERY}} 否则 ALIAS 不生效
        console.log(q);
        return {
          title: "Hello Word, Hello World",
          injectTable() {
            return "<div>table-html</div>";
          },
        };
      },
    });
    // generate output file for download
    downloadBlob(
      doc,
      "output.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  }
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
</script>
```
