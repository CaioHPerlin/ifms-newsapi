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
    store.add({
        nome: form.nome.value,
        idade: form.idade.value
    });
    await tx.done;
    form.reset();
}

async function getData() {
    if(db == undefined){
        showResult('O banco de dados está fechado');
        return;
    }

    const tx = await db.transaction('pessoas', 'readonly');
    const store = tx.objectStore('pessoas');
    const selection = await store.getAll();
    if(selection){
        showResult('Dados do banco: ' + JSON.stringify(selection));
    }else{
        showResult('Não há nenhum dado no banco!');
    }
}

function showResult(text){
    document.querySelector('output').innerHTML = text;
}
