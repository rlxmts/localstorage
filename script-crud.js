const botaoAddTarefa = document.querySelector('.app__button--add-task');
const formulario = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const listaDeTarefas = document.querySelector('.app__section-task-list');
let tarefas =  JSON.parse(localStorage.getItem('tarefas')) || [];
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefa(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarTarefa(tarefa){

    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>`
    
    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const tarefaEditada = prompt('Qual o novo nome da tarefa?');
        if(tarefaEditada){
            paragrafo.textContent = tarefaEditada;
            tarefa.descricao = tarefaEditada;
            atualizarTarefa();
        }else if(tarefaEditada == ''){
            alert('Digite o nome atualizado da tarefa!');
        }
    }

    const img = document.createElement('img');
    img.setAttribute('src', '/imagens/edit.png')    
    
    botao.append(img);
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'true');
    }else{
        li.onclick = ()=> {

            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach( item =>{
                item.classList.remove('app__section-task-list-item-active');
            })
            if(tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = li;
                return;
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;      
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }

    
    return li;
}


botaoAddTarefa.addEventListener('click', ()=>{
    formulario.classList.toggle('hidden');
    if(formulario.classList.contains('hidden')){
        botaoAddTarefa.innerHTML = `<img src="/imagens/add_circle.png" alt=""> Adicionar nova tarefa` ;                      
    }else{
        botaoAddTarefa.textContent = 'Cancelar';
    }
});

formulario.addEventListener( 'submit', (e)=> {
    e.preventDefault();
    const tarefa = {
        descricao : textArea.value 
    }
    tarefas.push(tarefa);
    const novaTarefa = criarTarefa(tarefa);
    atualizarTarefa();
    textArea.value = '';
    listaDeTarefas.append(novaTarefa);
    botaoAddTarefa.innerHTML = `<img src="/imagens/add_circle.png" alt=""> Adicionar nova tarefa` ;
    formulario.classList.add('hidden');
})

tarefas.forEach( tarefa => {
    const novaTarefa = criarTarefa(tarefa);
    listaDeTarefas.append(novaTarefa);
})

window.addEventListener( 'focoFinalizado', ()=> {
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'true');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    }
})

const botaoRemoverTodas = document.querySelector('#btn-remover-todas');
const botaoRemoverConcluidas = document.querySelector('#btn-remover-concluidas');

const removerTarefa = (somenteCompletas)=> {
    const seletor = somenteCompletas ?  '.app__section-task-list-item-complete': '.app__section-task-list-item' ;
    document.querySelectorAll(seletor).forEach( tarefa => {
        tarefa.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter( tarefa => !tarefa.completa) : [];
    atualizarTarefa();
}

botaoRemoverTodas.onclick = () => removerTarefa(false);
botaoRemoverConcluidas.onclick = () => removerTarefa(true);