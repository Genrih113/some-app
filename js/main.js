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
let storageKeyDivider = ':-:-:'; //это разделитель м-у ключом типа записи и названием записи и тп


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

// console.log(getDataFromStorage('notes', ':-:-:'));


//заполнение списка записей на странице; создание-заполнение-вставка
function createNotesListElTemplate() {
  let notesListEl = document.querySelector('#notes template')
    .content.querySelector('li').cloneNode(true);
  // console.log(notesListEl);
  return notesListEl;
}

function fillNotesListEl(text, node) {
  node.querySelector('input').value = text;
  node.querySelector('span').textContent = text;
  return node;
}

function pasteNotesListEl(node) {
  $notesList.append(node);
  // console.log(node);
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
//конец блока фичи записей
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------
//поведение фичи списка дел
let $todosFeat = $('#todos');
let $todosScreensRow = $todosFeat.find('.feat-slider__slides-row');
let $todosListActual = $todosFeat.find('.todos__list-actual');
let $todosListDone = $todosFeat.find('.todos__list-done');

// let $todosRemoveBtns = $todosFeat.find('.todo__remove-btn');
let $createTodoBtn = $todosFeat.find('.todos__create-btn');
let $toDoneTodosBtn = $todosFeat.find('.todos__to-done-btn');
let $toActualTodosBtn = $todosFeat.find('.todos__to-actual-btn');

let $confirmTodoPopup = $todosFeat.find('#popup-confirmation-todos');
let $confirmConfirmTodoBtn = $confirmTodoPopup.find('popup-btn-true');
let $cancelConfirmTodoBtn = $confirmTodoPopup.find('popup-btn-false');

let $createTodoPopup = $todosFeat.find('#popup-create-todo');
let $newTodoTextInput = $createTodoPopup.find('input');
let $confirmCreateTodoBtn = $createTodoPopup.find('.popup-btn-true');
let $cancelCreateTodoBtn = $createTodoPopup.find('.popup-btn-false');

let todoItemTemplate = document.querySelector('#todos template');
let todosLocalStorageGroupKey = 'todo';


$toDoneTodosBtn.on('click', function() {
  $todosScreensRow.css('transform', `translateX(-${$todosFeat.width() + 16 + 'px'})`);
})
$toActualTodosBtn.on('click', function() {
  $todosScreensRow.css('transform', 'translateX(0px)');
})

$createTodoBtn.on('click', function() {
  $createTodoPopup.removeClass('d-none');
  $newTodoTextInput.focus();
})
$cancelCreateTodoBtn.on('click', function() {
  $createTodoPopup.addClass('d-none');
  $newTodoTextInput.val('');
})
$confirmCreateTodoBtn.on('click', function() {
  let todoText = $newTodoTextInput.val();
  let data = new Date();
  let timeStampString = data.getTime().toString();
  localStorage.setItem(todosLocalStorageGroupKey + storageKeyDivider 
    + 'actual' + storageKeyDivider + timeStampString, todoText);
  refreshTodosLists();
  $createTodoPopup.addClass('d-none');
  $newTodoTextInput.val('');
})

$cancelConfirmTodoBtn.on('click', function() {
  $confirmTodoPopup.addClass('d-none');
})
$confirmConfirmTodoBtn.on('click', function() {
  confirmRemoveTodo();
  $confirmTodoPopup.addClass('d-none');
})


function createTodoTemplate() {
  let todoTemplate = todoItemTemplate.content.querySelector('li').cloneNode(true);
  return todoTemplate;
}

function fillTodoTemplate(text, timeStamp, actuality, node) {
  node.querySelector('.todo__text').textContent = text;
  let $input = $(node).find('input');
  if (actuality == 'done') $input.attr('checked', 'true');
  $input.attr('data-timestamp', timeStamp);
  $input.attr('data-actuality', actuality);
  $(node).find('button').on('click', removeTodo);
  $input.on('change', toggleTodoState)
  return node;
}

function pasteNode(whatPaste, wherePaste) {
  wherePaste.append(whatPaste);
}

// key - первая часть ключа записи в сторадже (групповой ключ типов записи), 
// вторая- уникальный ключ записи. н-р todo:-:-:todoName
function getDataArrayFromLocalStorage(groupKey) {
  let dataArr = [];
  let lsKey = '';
  for(let i = 0; i < localStorage.length; i++) {
    lsKey = localStorage.key(i);
    if (lsKey.startsWith(groupKey)) {
      dataArr.push([...lsKey.split(storageKeyDivider), localStorage.getItem(lsKey)]);
    }
  }
  console.log(dataArr);
  return dataArr;
}


function fillTodosLists() {
  let notes = getDataArrayFromLocalStorage(todosLocalStorageGroupKey);
  notes.forEach((el) => {
    if (el[1].startsWith('actual')) {
      pasteNode(fillTodoTemplate(el[3], el[2], el[1], createTodoTemplate()), $todosListActual);
    } else if (el[1].startsWith('done')) {
      pasteNode(fillTodoTemplate(el[3], el[2], el[1], createTodoTemplate()), $todosListDone);
    }
  });
}

function refreshTodosLists() {
  $todosListActual.empty();
  $todosListDone.empty();
  fillTodosLists();
}

fillTodosLists();


function removeTodo() {
  let li = this.closest('li');
  let input = li.querySelector('input');
  localStorage.removeItem(todosLocalStorageGroupKey + storageKeyDivider 
    + input.dataset.actuality + storageKeyDivider + input.dataset.timestamp);
  refreshTodosLists();
}

// function confirmRemoveTodo() {
//   $confirmTodoPopup.removeClass('.d-none');
//   removeTodo.bind(this);
// }

function toggleTodoState() {
  let actuality = this.dataset.actuality;
  let timestamp = this.dataset.timestamp;
  let text = this.closest('li').querySelector('.todo__text').textContent;
  localStorage.setItem(todosLocalStorageGroupKey + storageKeyDivider 
    + (this.checked ? 'done' : 'actual') + storageKeyDivider + timestamp, text);
  localStorage.removeItem(todosLocalStorageGroupKey + storageKeyDivider 
    + (this.checked ? 'actual' : 'done') + storageKeyDivider + timestamp);
  refreshTodosLists();
}

// function moveTodoToDone() {
//     $todosListDone.append(this.closest('li').cloneNode(true));
//     this.closest('li').remove();
// }
// function moveTodoToActual() {
//   $todosListActual.append(this.closest('li').cloneNode(true));
//   this.closest('li').remove();
// }


// $todosRemoveBtns.on('click', removeTodo);

// $todosCheckboxesActual.on('click', moveTodoToDone);
// $todosCheckboxesDone.on('click', moveTodoToActual);

// console.log($todosCheckboxesDone)