document.addEventListener('DOMContentLoaded', function () {

  var board = document.querySelector('#board');
  var newNoteBtn = document.querySelector('#addNewNote');
  var notesArr = [];

  if(localStorage.getItem('notes')){
    notesArr = JSON.parse(localStorage.getItem('notes'));
  }

  // конструктор объектов (с параметрами)
  function Note(x,y,content){
    this.x = x;
    this.y = y;
    this.content = content;
  }

  var deltaX;
  var deltaY;
  var dragNote;
  var dragObj;

  // функция для перемещения одной заметки и записи координат в текущий объект
  function stickToMouse(e) {
    dragNote.style.left = (e.pageX - deltaX) + 'px';
    dragNote.style.top = (e.pageY - deltaY) + 'px';

    dragObj.x = (e.pageX - deltaX);
    dragObj.y = (e.pageY - deltaY);
  }

  // функция для создания разметки одной заметки
  function createOneNoteMarkup(object,index){
    var tempNote = document.createElement('div');
    tempNote.classList.add('note');
    tempNote.style.left = object.x + 'px';
    tempNote.style.top = object.y + 'px';


    // формирование кнопки удаления
    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = 'X';

    // обработчик клика по кнопке удаления
    deleteBtn.onclick = function(){
      notesArr.splice(index,1);
      // запись данных в localStorage 
      localStorage.setItem('notes',JSON.stringify(notesArr));
      renderHTML();
    }


    var contentArea = document.createElement('textarea');
    contentArea.classList.add('contentArea');

    contentArea.oninput = function () {
      object.content = contentArea.value;
     localStorage.setItem('notes',JSON.stringify(notesArr));
    };

    var saveBtn = document.createElement('button');
    saveBtn.classList.add('saveButton');
    saveBtn.textContent = 'Ok';

    saveBtn.onclick = function() {

    };

    tempNote.appendChild(saveBtn);
    tempNote.appendChild(contentArea);
    tempNote.appendChild(deleteBtn);
    return tempNote;
  }

  // функция отрисовки всех объектов
  function renderHTML(){
    board.innerHTML = '';
    notesArr.map(function(item,index){
      var newNote = createOneNoteMarkup(item,index);
      // вешаем обработчик события на каждую заметку
      newNote.onmousedown = function (e) {
        window.addEventListener('mousemove', stickToMouse);
        deltaX = e.pageX - newNote.offsetLeft;
        deltaY = e.pageY - newNote.offsetTop;
        // текущая заметка - та по которой кликнули
        dragNote = newNote;
        // текущий объект - объект той заметки по которой кликнули
        dragObj = item;
console.log(notesArr)
        // dragNote,dragObj - эти глобальные переменные нам нужны в функции stickToMouse
      }
    
      newNote.onmouseup = function (e) {
        window.removeEventListener('mousemove', stickToMouse);
        // запись данных в localStorage 
        localStorage.setItem('notes',JSON.stringify(notesArr));
      }
      // добавляем заметку в html
      board.appendChild(newNote);
    });
  }

  renderHTML();

  // обработчик клика по кнопке создания новой заметки
  newNoteBtn.onclick = function(){
    notesArr.push(new Note(10,10));
    // запись данных в localStorage 
    localStorage.setItem('notes',JSON.stringify(notesArr));
    renderHTML();
  }

});