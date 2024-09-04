////// "раздел" для работы с книгами    //////////////
///////////////////////////////////////////////////////

// таблица с книгами и кнопка для открытия формы 
function createTableBooks(data) {
    cleanDivMain();
    createDivMain();
    // создание кнопки для появления формы
    var buttonCreateBook =document.createElement("button");
    buttonCreateBook.classList.add("buttonCreateBook");
    buttonCreateBook.innerHTML = "Добавить новую книгу";
    document.getElementById('divMain').append(buttonCreateBook);

    // событие кнопки для "открытия" формы
    buttonCreateBook.onclick= function() {
        return formCreateBook();  
    }

    // блок для таблицы с книгами
    var divTableBooks =document.createElement("div");
    divTableBooks.classList.add("divTableBooks");
    document.getElementById('divMain').append(divTableBooks);

    // создание таблицы с книгами и вывод данных 
    var tableBooks ="<table class='tableBooks' id='tableBooks' border='1'>"
    +"<tr>"
        +"<th>Номер</th>"
        +"<th>Автор</th>"
        +"<th>Название</th>"
        +"<th>Жанр</th>"
        +"<th>Издательство</th>"
        +"<th>Статус</th>"
        +"<th>Удалить</th>"
      
    +"</tr>";
    for(x in data) {
    tableBooks+="<tr onclick = 'deleteBook(this)'>"
        +"<td>"+data[x].id+"</td>"
        +"<td>"+data[x].surname+" "+data[x].name+" "
        +data[x].lastname+"</td>"
        +"<td>"+data[x].title+"</td>"
        +"<td>"+data[x].genre+"</td>"
        +"<td>"+data[x].nameHouse+"</td>";
        if(data[x].inLibr == 1) {
            tableBooks+="<td>В наличии</td>";}
        else {
            tableBooks+="<td style='background:rgb(179, 235, 95)';>Выдана</td>";
        } 
        tableBooks+="<td class='tdDelete'>Удалить</td>"
        +"</tr>";
    }
    +"</table>";
    divTableBooks.innerHTML = tableBooks;
}

// формы для добавления новой книги
function formCreateBook() {
    // блок для формы
	var divFormCreateBook = document.createElement("div");
    divFormCreateBook.classList.add("divFormCreateBook");
	divFormCreateBook.id = 'divFormCreateBook';
	document.getElementById('divMain').append(divFormCreateBook);
	
	var formCreateBook = "<div id='divForm'>"
    // "закрытие" формы 
	+"<button class='btnCloseForm' onclick= divMain.removeChild(document.getElementById('divFormCreateBook'))>Закрыть</button>"
	    // форма, сделанная таблицей
    +"<form id='formCreateBook'><table>"   
       +"<tr><td>Автор</td>"
       // в select AJAX'ом "придут" авторы
       +"<td><select id ='selectAuthors' name='selectAuthors'>"
       +"<Option value=''>Выбор автора</Option>"
       +"</select>"
       // кнопка для создания формы для добавления нового автора
       +"<button type='button' onclick=createNewAuthor()>"
       +"Добавить автора</button></td></tr>"
       +"<tr><td>Название</td>"
       +"<td><input type='text' name='title' value ='' ></input></td></tr>"
       +"<tr><td>Жанр книги</td>"
       +"<td><select name='genre' required>"
          +"<Option value=' '>Выбрать жанр</Option>"
          +"<Option value='1'>поэма</Option>"
          +"<Option value='2'>трагедия</Option>"
          +"<Option value='3'>роман</Option>"
          +"<Option value='4'>стихи</Option>"
          +"<Option value='5'>повесть</Option>"
          +"<Option value='6'>комедия</Option>"
          +"</select></td></tr>"
  +"<tr><td>Издательство</td>"			
  +"<td><input type='radio' name='nameHouse' value='1'>АСТ</input>"
  +"<input type='radio' name='nameHouse'  value='2'>Бонни</input></td></tr></table>"
  +"<button type='button' class='btnCreateBook' onclick='createBook()''>Добавить книгу</button>"
  +"</form>"
  +"</div>"; 
  	divFormCreateBook.innerHTML = formCreateBook;
  // получает авторов и наполняет select 
makeSelectAuthors();
};

// "сбор" введённых в форму данных создаваемой книги
function getFormCreateBookData() {
    var book = {
        method:"create",
        idAuthor:document.forms["formCreateBook"]["selectAuthors"].value,
        title:document.forms["formCreateBook"]["title"].value,
        idGenre:document.forms["formCreateBook"]["genre"].value,
        idHouse:document.forms["formCreateBook"]["nameHouse"].value
     }
    return JSON.stringify(book);
    } 

// отправка AJAX'ом данных о новой книге 
function createBook() {
    var newBook = getFormCreateBookData();
    zaprosPostAjax('../controllers/BookController.php', newBook);
    zaprosGetAjax('../controllers/BookController.php'+'?'+'method=readAll', createTableBooks);
}

// удаление ненужной или некорректно введённой книги
function deleteBook(tr) {
    if(confirm("Вы уверены, что хотите удалить данную книгу?")
     == true) {   
        var indexReader = tr.rowIndex; // номер строки 
        var table = document.getElementById('tableBooks');
    // по строке получение id книги
    // да, с jQuery это проще :(
    var dataBook = {
        method:"delete",
        id:table.rows[indexReader].cells[0].innerHTML
    }
    dataBook = JSON.stringify(dataBook);
    zaprosPostAjax('../controllers/BookController.php', dataBook);   
    zaprosGetAjax('../controllers/BookController.php'+'?'+'method=readAll', createTableBooks);    
    } 
}

// а вот и создание заявленных ранее select'ов с авторами
function makeSelectAuthors() {
    zaprosGetAjax('../controllers/AuthorController.php'+'?'+'method=readAll', 
    function(data) {
        for (x in data) {
            document.getElementById('selectAuthors').innerHTML+=
            "<option value='"+data[x].id+"'>"+ data[x].surname+" "+data[x].name+" "
            +data[x].lastname+"</option>"
         }
    })
}

// создание нового автора
function createNewAuthor() {
    // блок для формы 
    var divFormCreateAuthor =document.createElement("div");
    divFormCreateAuthor.classList.add("divFormCreateAuthor");
	divFormCreateAuthor.id = 'divFormCreateAuthor';
	document.getElementById('divFormCreateBook').append(divFormCreateAuthor);
// форма 
    var formCreateAuthor = "<div>"
    // кнопка для "закрытия" формы 
	+"<button class='btnCloseForm' onclick=divFormCreateBook.removeChild(document.getElementById('divFormCreateAuthor'))>Закрыть</button>"
    +"<form id='formCreateAuthor'><table>"
      +"<tr><td>Фамилия</td>"
      +"<td><input type='text' name='surname' value ='' ></input></td></tr>"
      +"<tr><td>Имя</td>"
      +"<td><input type='text' name='name' value ='' ></input></td></tr>"
      +"<tr><td>Отчество</td>"
      +"<td><input type='text' name='lastname' value ='' ></input></td></tr></table>"
      +"<button type='button' class='btnCreateAuthor' onclick = 'createAuthor()' "
      +"'>Добавить нового автора</button>"
    +"</form>"
    +"</div>";
    divFormCreateAuthor.innerHTML = formCreateAuthor;
}
 
// получение из формы данных о новом авторе
function getFormCreateAuthorData() {
    var author = {
        method:"create",
        surname:document.forms["formCreateAuthor"]["surname"].value,
        name:document.forms["formCreateAuthor"]["name"].value,
        lastname:document.forms["formCreateAuthor"]["lastname"].value
    };
    return JSON.stringify(author);
}

// отправка данных создаваемого автора
function createAuthor() {
    var newAuthor  = getFormCreateAuthorData();
    zaprosPostAjax('../controllers/AuthorController.php', newAuthor);
   
    // обновить select с авторами
    makeSelectAuthors();
    divFormCreateBook.removeChild(document.getElementById('divFormCreateAuthor'));
} 

