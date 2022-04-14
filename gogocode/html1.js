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
      methodsList = scriptAst.find('methods:{ $$$0 }')

      fn(methodsList)
      content.value.content = scriptAst.generate()
    }
  })

  return ast.generate()

}


function fn(ast) {

  ast.replace(
    '$_$: function($$$0){ $$$1 }',
    '$_$($$$0){ $$$1 }'
  )
  ast.replace('$_$: function(){ $$$1 }', '$_$(){ $$$1 }')

}