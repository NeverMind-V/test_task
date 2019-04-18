//
// global libs

function dialogFormHandler() {
    let link = document.querySelector('.js-popup');
    let form = document.querySelector('.js-dialog');
    if(!form) return;
    let submit = document.querySelector('.js-btn-submit');
    let close = document.querySelectorAll('.js-close,.js-btn-close');
    link.addEventListener('click',function(e) {
        e.preventDefault();
        form.classList.add('open','slideDown');
    });
    close.forEach( btn => {
        btn.addEventListener('click',function() {
            form.classList.remove('slideDown');
            form.classList.add('zoomOut');
            setTimeout(function() {
                form.classList.remove('open','zoomOut');
            },600);
        });
    });
    submit.addEventListener('click',function() {
        form.classList.remove('slideDown');
        form.classList.add('zoomOut');
        setTimeout(function() {
            form.classList.remove('open','zoomOut');
            alert('DONE');
        },500);
        
    });
}

function getUrl(url) {
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState<4) {
            }
            else if (xhr.status===200) {
                resolve(xhr.responseText);
            }
            else {
                reject(xhr.status);
            }
        };
        xhr.open('GET',url,true);
        xhr.send();
    });
}

function searchInit() {
    let query = '';    
    let search = document.querySelector('.book-search-input');
    let container = document.querySelector('.book-search-result');
    let delay = (callback, ms) => {
        let timer = 0;
        return function() {
            let context = this;
            let args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                callback.apply(context, args);
            },ms);
        }
    };
    search.addEventListener('input',delay(async function() {
        query = this.value.split(' ').join('+');
        if(query.length >= 3) {         
            try {
                container.innerHTML = '';
                let data = await getUrl(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
                let books = await JSON.parse(data);
                console.log('books',books);
                books.items.forEach(book => {
                    let {title,authors} = book.volumeInfo;
                    console.log(book.volumeInfo.title);
                    let div = document.createElement('div');
                    div.className = 'book';
                    let h2 = document.createElement('h2');
                    h2.className = 'book__title';
                    h2.innerText = `${title}`;
                    div.appendChild(h2);
                    let p = document.createElement('p');
                    p.className = 'book__authors';
                    p.innerText = `Authors: ${authors.join(', ')}`;
                    div.appendChild(p);
                    container.appendChild(div);
                });
            } catch(error) {
                console.log(error);
            }               
        }
    },3000));
}

window.addEventListener('load',function() {
    dialogFormHandler();
    searchInit();
});