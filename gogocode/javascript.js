function transform(fileInfo, api, options) {
  const $ = api.gogocode
  const source = fileInfo.source
  ast = $(source, { parseOptions: { language: 'js' } })

  methodsList = ast.find('computed:{$$$0}')
  // console.log(methodsList)

  methodsList.each((nodeAstItem) => {
    nodeAst = nodeAstItem[0]
    nodePath = nodeAst.nodePath
    nodeMatch = nodeAst.match
    // console.log(nodeMatch)
    var $$$0 = nodeMatch.$$$0
    $$$0.forEach((v) => {

      if (v.type === 'ObjectProperty') {

        console.log(v)


      }

    })
  })

  return 'ww'
}
