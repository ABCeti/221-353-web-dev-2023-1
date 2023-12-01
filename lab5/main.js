// Функция создания HTML-элемента для отображения имени автора
function createAuthorElement(record) {
    let user = record.user || { 'name': { 'first': '', 'last': '' } };
    let authorElement = document.createElement('div');
    authorElement.classList.add('author-name');
    authorElement.innerHTML = user.name.first + ' ' + user.name.last;
    return authorElement;
}

// Функция создания HTML-элемента для отображения количества голосов вверх
function createUpvotesElement(record) {
    let upvotesElement = document.createElement('div');
    upvotesElement.classList.add('upvotes');
    upvotesElement.innerHTML = record.upvotes;
    return upvotesElement;
}

// Функция создания подвала с информацией об авторе и голосах
function createFooterElement(record) {
    let footerElement = document.createElement('div');
    footerElement.classList.add('item-footer');
    footerElement.append(createAuthorElement(record));
    footerElement.append(createUpvotesElement(record));
    return footerElement;
}

// Функция создания HTML-элемента для отображения содержимого записи
function createContentElement(record) {
    let contentElement = document.createElement('div');
    contentElement.classList.add('item-content');
    contentElement.innerHTML = record.text;
    return contentElement;
}

// Функция создания HTML-элемента списка с содержимым и подвалом
function createListItemElement(record) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('facts-list-item');
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}

// Функция отрисовки записей
function renderRecords(records) {
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]));
    }
}

// Функция обновления информации о пагинации
function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count && (info.current_page - 1) * info.per_page + 1;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end;
}

// Функция создания кнопки для пагинации
function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}

// Функция отрисовки элементов пагинации
function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        btn = createPageBtn(i, i == info.current_page ? ['active'] : []);
        buttonsContainer.append(btn);
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}

// Функция загрузки данных
function downloadData(page = 1, searchQuery = '') {
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    url.searchParams.append('page', page);
    url.searchParams.append('per-page', perPage);
    
    if (searchQuery !== '') {
        url.searchParams.append('q', searchQuery);
    }

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}

// Обработчик события изменения "per-page" dropdown
function perPageBtnHandler(event) {
    downloadData(1);
}

// Обработчик события кнопок пагинации
function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        downloadData(event.target.dataset.page);
        window.scrollTo(0, 0);
    }
}

// Обработчик события загрузки страницы
window.onload = function () {
    downloadData();
    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('.per-page-btn').onchange = perPageBtnHandler;
    document.querySelector('.search-btn').onclick = function () {
        const searchField = document.querySelector('.search-field');
        const searchQuery = searchField.value.trim();
        if (searchQuery !== '') {
            downloadData(1, searchQuery);
        }
    };

    document.querySelector('.search-field').addEventListener('input', function () {
        const searchQuery = this.value.trim();
        if (searchQuery !== '') {
            fetchAutocomplete(searchQuery);
        } else {
            clearAutocomplete();
        }
    });
};

// Функция получения предложений автозаполнения
function fetchAutocomplete(searchQuery) {
    const autocompleteUrl = `http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete?q=${encodeURIComponent(searchQuery)}`;

    fetch(autocompleteUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => displayAutocomplete(data))
        .catch(error => console.error('Error fetching autocomplete:', error));
}

// Функция отображения предложений автозаполнения
function displayAutocomplete(suggestions) {
    const autocompleteList = document.querySelector('.autocomplete-list');

    autocompleteList.innerHTML = '';

    suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        listItem.textContent = suggestion;
        listItem.addEventListener('click', function () {
            document.querySelector('.search-field').value = suggestion;
            clearAutocomplete();
            downloadData(1, suggestion);
        });
        autocompleteList.appendChild(listItem);
    });

    autocompleteList.style
