$(function() {
  $('#search').keyup(function() {
    var search_term = $(this).val()
    $.ajax({
      method: 'POST',
      url: '/api/search',
      data: {
        search_term
      },
      dataType: 'json',
      success: function(json) {
        var data = json.hits.hits.map(function(hit) {
          return hit
        })
        $('#searchResults').empty()
        for(var i = 0; i < data.length; i++) {
          var html = "";
          html += '<div class="col-md-4">'
          html += '<a href="/product/' + data[i]._source._id +'">'
          html += '<div class="thumbnail">'
          html += '<img src="' + data[i]._source.image +  '" alt="">'
          html += '<div class="caption">'
          html += '<h3>' +  data[i]._source.name + '</h3>'
          html += '<p>' +  data[i]._source.category.name + '</p>'
          html += '<p> $ ' +  data[i]._source.price  +'</p>'
          html += '</div></div></a></div>'
          $('#searchResults').append(html)
        }
      },
      error: function(error) {
        console.log(error)
      }
    })
  })
})

$(document).on('click', '#plus', function(e) {
  e.preventDefault()
  var priceValue = parseFloat($('#priceValue').val())
  var quantity = parseInt($('#quantity').val())
  priceValue += parseFloat($('#priceHidden').val())
  quantity += 1
  $('#quantity').val(quantity)
  $('#priceValue').val(priceValue.toFixed(2))
  $('#total').html(quantity)
})

$(document).on('click', '#minus', function(e) {
  e.preventDefault()
  var priceValue = parseFloat($('#priceValue').val())
  var quantity = parseInt($('#quantity').val())
  if(quantity == 1) {
    priceValue = $('#priceHidden').val()
    quantity = 1
  } else {
    priceValue -= parseFloat($('#priceHidden').val())
    quantity -= 1    
  }
  $('#quantity').val(quantity)
  $('#priceValue').val(priceValue.toFixed(2))
  $('#total').html(quantity)
})






















//some custom method
