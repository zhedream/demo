$.ajaxSettings.async = false;


let templateBox = $('<div></div>');
templateBox.attr('id', 'templateBox')

$.get(
  'components/components.html',
  function (params) {
    // console.log(params);
    let a = $('<div></div>').html(params)
    templateBox.append(a)
  }
)

$('body').append(templateBox)
setTimeout(() => {
  templateBox.remove()
}, 0)

$.ajaxSettings.async = true;