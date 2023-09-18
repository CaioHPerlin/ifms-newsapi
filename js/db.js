import { openDB } from 'idb';

let db;

async function createDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch(oldVersion){
                    case 0:
                    case 1:
                        const store  = db.createObjectStore('pessoas', {
                            // A propriedade nome será o campo chave
                            keyPath: 'nome'
                        });
                        // Criando um indice id na store, deve estar contido no objeto do banco.
                        store.createIndex('id', 'id');
                        showResult('Banco de dados criado!');
                }
            }
        });
        showResult('Banco de dados aberto.');
    } catch(e){
        showResult('Erro ao criar o banco de dados '+e.message);
    }
}

window.addEventListener('DOMContentLoaded', async (e) => {
    createDB();
    
    const form = document.getElementsByTagName('form')[0]
    form.addEventListener('submit', (e) => {e.preventDefault(); addData(form)});

    const buttons = document.getElementsByTagName('button');
    buttons[1].addEventListener('click', getData);

});


async function addData(form) {
    if(db == undefined){
        showResult('O banco de dados está fechado');
        return;
    }

    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.put({
        nome: form.nome.value,
        idade: form.idade.value
    });
    await tx.done;
    form.reset();
    getData();
}

async function deleteData(userName) {
    if(db == undefined){
        showResult('O banco de dados está fechado');
        return;
    }

    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    const user = await store.get(userName);
    if(user){
        store.delete(userName);
        getData();
    }else{
        showResult('Usuário não encontrado no banco!');
    }
}


async function getData() {
    if(db == undefined){
        showResult('O banco de dados está fechado');
        return;
    }

    const tx = await db.transaction('pessoas', 'readonly');
    const store = tx.objectStore('pessoas');
    const selection = await store.getAll();
    showUsers(selection)
    
    if(selection.length == 0){
        showResult('Não há nenhum dado no banco!')
    }
}

function showUsers(users){
    const list = document.querySelector('.user-list');
    list.innerHTML = '';
    users.map(user => {
        const userHTML = document.createElement('code');

        const userInfo = document.createElement('h2');
        userInfo.innerHTML = `${user.nome} | ${user.idade}`

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.addEventListener('click', () => deleteData(user.nome))

        userHTML.appendChild(userInfo);
        userHTML.appendChild(deleteButton);

        list.appendChild(userHTML);
    })
}

function showResult(text){
    document.querySelector('output').innerHTML = text;
}
