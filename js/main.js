//--------------------------------------------------------------------
// хедер и переключение фич в мейне
let slidesSpace = 16; //расстояние м-у слайдами в пкс
let stepValue = 0; //шаг смещения строки со слайдами
let steps = 0; //количество произведенных шагов

let $header = $('.header');
let $sliderWindow = $header.find('.slider');
let $sliderBtns = $header.find('.slider-button');
let $slidesRow = $header.find('.slider__slides-row');
let $slideBtns = $header.find('.slide__button');

stepValue = $sliderWindow.width() + slidesSpace;


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


//переключение между фунционалом по клику на название фичи в хедере
$slideBtns.on('click', function () {
  console.log(this.dataset.feat);
  console.log($featSliders);
  $slideBtns.removeClass('slider-button_selected');
  this.classList.add('slider-button_selected');
  $featSliders.filter(`:not(#${this.dataset.feat})`).fadeOut();
  $featSliders.filter(`#${this.dataset.feat}`).delay(400).fadeIn();
})


//слайдер функций в мейне
let $featContainer = $('.feat-container');
let $featSliders = $('.feat-slider');


//--------------------------------------------------------------------
//поведение фичи записей
let $notesFeat = $('#notes');
let $notesScreensRow = $notesFeat.find('.feat-slider__slides-row');
let $notesList = $notesFeat.find('ul');
// let $notesInputs = $notesFeat.find('input');
let $notesBtns = $notesFeat.find('.notes__btn');
let $note = $notesFeat.find('.note');
let $noteText = $note.find('.note__text');
let $noteBtns = $note.find('.note__btn');
let $noteCreatePopup = $notesFeat.find('#popup-create-note');
let $noteConfirmPopup = $notesFeat.find('#popup-confirmation-notes');
// let confirmationNoteRemove = false;
let storageKeyNotes = 'notes'; //по этому ключу в локальном хранилище ищутся записи
let storageKeyDivider = ':-:-:'; //этот разделитель м-у ключом типа записи и названием


function findSelectedNoteInput() {
  return $notesFeat.find('input').filter(':checked'); // $notesInputs.filter(':checked');
}
function isNoteSelected() {
  return findSelectedNoteInput().length;
}


//открытие файла
$notesBtns.filter('#notes-open').on('click', function () {
  if (isNoteSelected()) {
    $notesScreensRow.css('transform', `translateX(-${$notesFeat.width() + 16 + 'px'})`);
    $noteText.text(localStorage.getItem(storageKeyNotes + storageKeyDivider + findSelectedNoteInput().val()))
    $note.removeClass('d-none');
  }
})
$noteBtns.filter('#note-cancel').on('click', function () {
  $notesScreensRow.css('transform', `translateX(0px)`);
  $note.addClass('d-none');
  $noteText.text('');
})
$noteBtns.filter('#note-save').on('click', function () {
  localStorage.setItem(storageKeyNotes + storageKeyDivider + findSelectedNoteInput().val(), $noteText.text());
})


//удаление файла
$notesBtns.filter('#notes-remove').on('click', function () {
  if (isNoteSelected()) $noteConfirmPopup.removeClass('d-none');
})
$noteConfirmPopup.find('.popup-btn-true').on('click', function () {
  let selectedInput = findSelectedNoteInput();
  localStorage.removeItem(storageKeyNotes + storageKeyDivider + selectedInput.val());
  selectedInput.closest('li').remove();
  $noteConfirmPopup.addClass('d-none');
})
$noteConfirmPopup.find('.popup-btn-false').on('click', function () {
  $noteConfirmPopup.addClass('d-none');
})


//создание файла
$notesBtns.filter('#notes-new').on('click', function () {
  $noteCreatePopup.removeClass('d-none');
  $noteCreatePopup.find('input').focus();
})
$noteCreatePopup.find('.popup-btn-false').on('click', function () {
  $noteCreatePopup.addClass('d-none');
  $noteCreatePopup.find('input').val('');
})
$noteCreatePopup.find('.popup-btn-true').on('click', function () {
  let noteName = $noteCreatePopup.find('input').val();
  if (noteName) {
    localStorage.setItem(storageKeyNotes + storageKeyDivider + noteName, '');
    pasteNotesListEl(fillNotesListEl(noteName, createNotesListElTemplate()));
    $noteCreatePopup.addClass('d-none');
    $noteCreatePopup.find('input').val('');
  }
})


//получение записей из хранилища
function getDataFromStorage(key, divider) {
  let dataArr = [];
  let lsKey = '';
  for(let i = 0; i < localStorage.length; i++) {
    lsKey = localStorage.key(i);
    if (lsKey.startsWith(key)) {
      dataArr.push([`${lsKey.split(divider)[1]}`, localStorage.getItem(lsKey)]);
    }
  }
  return dataArr;
}

console.log(getDataFromStorage('notes', ':-:-:'));


//заполнение списка записей на странице; создание-заполнение-вставка
function createNotesListElTemplate() {
  let notesListEl = document.querySelector('#notes template')
    .content.querySelector('li').cloneNode(true);
  console.log(notesListEl);
  return notesListEl;
}

function fillNotesListEl(text, node) {
  node.querySelector('input').value = text;
  node.querySelector('span').textContent = text;
  return node;
}

function pasteNotesListEl(node) {
  $notesList.append(node);
  console.log(node);
}

//pasteNotesListEl(fillNotesListEl('ghghghgh', createNotesListElTemplate()));

function clearNotesList() {
  $notes.empty();
}

function fillNotesList() {
  let notes = getDataFromStorage(storageKeyNotes, storageKeyDivider);
  notes.forEach((el) => {
    pasteNotesListEl(fillNotesListEl(el[0], createNotesListElTemplate()));
  });
}

fillNotesList();