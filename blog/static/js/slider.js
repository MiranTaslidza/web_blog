jQuery(document).ready(function ($) {
    // Prolazi kroz svaki container koji sadrži slider (pretpostavljamo da su slideri unutar .img_box)
    $('.img_box').each(function() {
      var $imgBox = $(this);
      // Pronalazi slider unutar trenutnog .img_box
      var $slider = $imgBox.find('#slider');
      if (!$slider.length) return; // Ako slider nije pronađen, preskoči
  
      var $ul = $slider.find('ul');
      var $lis = $ul.find('li');
      var slideCount = $lis.length;
      
      // Izračunaj širinu i visinu prvog slajda (pretpostavlja se da su svi isti)
      var slideWidth = $lis.first().width();
      var slideHeight = $lis.first().height();
      var sliderUlWidth = slideCount * slideWidth;
      
      // Postavi dimenzije slidera
      $slider.css({ width: slideWidth, height: slideHeight });
      $ul.css({ width: sliderUlWidth, marginLeft: -slideWidth });
      
      // Premesti poslednji li na početak
      $ul.find('li:last-child').prependTo($ul);
    
      // Funkcija za pomeranje ulevo
      function moveLeft() {
        $ul.animate({
            left: + slideWidth
        }, 200, function () {
            $ul.find('li:last-child').prependTo($ul);
            $ul.css('left', '');
        });
      }
    
      // Funkcija za pomeranje udesno
      function moveRight() {
        $ul.animate({
            left: - slideWidth
        }, 200, function () {
            $ul.find('li:first-child').appendTo($ul);
            $ul.css('left', '');
        });
      }
    
      // Poveži klik događaje samo za ovaj slider
      $slider.find('a.control_prev').click(function (e) {
        e.preventDefault();
        moveLeft();
      });
    
      $slider.find('a.control_next').click(function (e) {
        e.preventDefault();
        moveRight();
      });
    
      // Automatsko pomeranje svakih 5 sekundi za ovaj slider
      setInterval(function () {
        moveRight();
      }, 5000);
    });
  });
  