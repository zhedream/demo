function transform(fileInfo, api, options) {
  const $ = api.gogocode
  const source = fileInfo.source
  ast = $(source, { parseOptions: { language: 'html' } })

  scriptNodeList = ast.find('<script></script>')
  scriptNodeList.each((nodeItem) => {
    var nodePath = nodeItem[0].nodePath
    var node = nodePath.node
    var content = node.content
    if (
      content.value &&
      content.value.type === 'token:script-tag-content'
    ) {
      // console.log(content.value.content)
      scriptAst = $(content.value.content)
      methodsList = scriptAst.find('methods:{$$$0}')
      // console.log(methodsList)

      methodsList.each((nodeAstItem) => {
        nodeAst = nodeAstItem[0]
        nodePath = nodeAst.nodePath
        nodeMatch = nodeAst.match
        console.log(nodeMatch)
        var $$$0 = nodeMatch.$$$0
        $$$0.forEach(v => {


        })

      })
    }
  })

  // return your transformed code here
  return 'ww'
}
