$.ajaxSettings.async = false;
let components = [
  'components/hello.html',
  'components/world.html',
]

let templateBox = $('<div></div>');
templateBox.attr('id', 'templateBox')

for (const component of components) {
  $.get(
    component,
    function (params) {
      // console.log(params);
      let a = $('<div></div>').html(params)
      templateBox.append(a)
    }
  )
}

$('body').append(templateBox)
setTimeout(() => {
  templateBox.remove()
}, 0)

$.ajaxSettings.async = true;