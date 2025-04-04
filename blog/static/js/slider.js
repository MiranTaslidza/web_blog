$(document).ready(function () {
  $('#thumbnail li').click(function () {
      // Pronađi trenutno aktivnu sliku u slideru
      var thisIndex = $(this).parent().index();
      var slider = $('#image-slider ul');

      // Uklanjamo 'active-img' sa trenutne slike i dodajemo ga novoj slici
      slider.find('li.active-img').removeClass('active-img');
      slider.find('li').eq(thisIndex).addClass('active-img');

      // Uklanjamo 'active' sa trenutnog thumbnail-a i dodajemo ga novom
      $('#thumbnail li.active').removeClass('active');
      $(this).addClass('active');
  });
});

var width = $('#image-slider').width();

function nextImage(newIndex, parent){
	parent.find('li').eq(newIndex).addClass('next-img').css('left', width).animate({left: 0},600);
	parent.find('li.active-img').removeClass('active-img').css('left', '0').animate({left: -width},600);
	parent.find('li.next-img').attr('class', 'active-img');
}
function prevImage(newIndex, parent){
	parent.find('li').eq(newIndex).addClass('next-img').css('left', -width).animate({left: 0},600);
	parent.find('li.active-img').removeClass('active-img').css('left', '0').animate({left: width},600);
	parent.find('li.next-img').attr('class', 'active-img');
}

/* Thumbails */
var ThumbailsWidth = ($('#image-slider').width() - 18.5)/7;
$('#thumbnail li').find('img').css('width', ThumbailsWidth);

