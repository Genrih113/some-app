// хедер
let slidesSpace = 16; //расстояние м-у слайдами в пкс
let stepValue = 0; //шаг смещения строки со слайдами
let steps = 0; //количество произведенных шагов

let $header = $('.header');
let $sliderWindow = $header.find('.slider');
let $sliderBtns = $header.find('.slider-button');
let $slidesRow = $header.find('.slider__slides-row');
let $slideBtns = $header.find('.slide__button');

stepValue = $sliderWindow.width() + slidesSpace;

// console.log($sliderWindow);

//движение списка фич в хедере
function moveSlidesRow () {
  if (this.dataset.side == 'right' && steps < ($slideBtns.length - 1)) {
    steps++;
    $slidesRow.css('transform', `translateX(-${stepValue * steps + 'px'})`);
  } else if ((this.dataset.side == 'left' && steps > 0 )) {
    steps--;
    $slidesRow.css('transform', `translateX(-${stepValue * steps + 'px'})`);
  }
}
$sliderBtns.on('click', moveSlidesRow);


//переключение между фунционалом
$slideBtns.on('click', function () {
  console.log(this.dataset.feat);
  console.log($featSliders);
  $slideBtns.removeClass('slider-button_selected');
  this.classList.add('slider-button_selected');

  // $featSliders.filter(`:not(#${this.dataset.feat})`).addClass('d-none');
  // $featSliders.filter(`#${this.dataset.feat}`).removeClass('d-none');
  $featSliders.filter(`:not(#${this.dataset.feat})`).fadeOut();
  $featSliders.filter(`#${this.dataset.feat}`).delay(400).fadeIn();
})


//поведение слайдера функций
let $featContainer = $('.feat-container');
let $featSliders = $('.feat-slider');

