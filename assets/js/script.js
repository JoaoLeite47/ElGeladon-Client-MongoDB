const baseURL = 'http://localhost:3000/paletas'; //url base rodando em servidor local

async function find_All_Paletas() {
  //no front end não é aconselhavel usar arrow
  const response = await fetch(`${baseURL}/all-paletas`); //fetch é uma função nativa do js

  const paletas = await response.json(); //retorna um json

  paletas.forEach(function (paleta) {
    //para cada paleta na lista será interada um elemento novo em html
    document.querySelector('#paletaList').insertAdjacentHTML(
      'beforeend',
      `
    <div class="Paleta_Lista_Item" id="Paleta_Lista_Item_${paleta._id}">
        <div>
            <div class="Paleta_Lista_Item__sabor">${paleta.sabor}</div>
            <div class="Paleta_Lista_Item__preco">R$: ${paleta.preco}</div>
            <div class="Paleta_Lista_Item__descricao">${paleta.descricao}</div>

            
             <div class="Paleta_Lista_Item_acoes acoes">
                <button class="Acoes_editar btn" onclick="show_Modal('${paleta._id}')">Editar</button>
                <button class="Acoes_apagar btn" onclick="modal_delete('${paleta._id}')">Apagar</button>
              </div>

        </div>

          <img class="Paleta_Lista_Item__foto" src="${paleta.foto}" alt="${paleta.sabor}" />

    </div>
        `,
    );
  });
}
find_All_Paletas(); //chama a função find_All_Paletas() quando a página for carregada

async function find_By_Id_Paletas() {
  //busca por id
  const id = document.querySelector('#idPaleta').value; //pega o valor do input
  if (id == '') {
    //se o id for vazio retorna uma mensagem de error
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, preencha o campo de id!',
    });
  }
  const response = await fetch(`${baseURL}/paleta/${id}`); //fetch é uma função nativa do js com base na roda get by id no backend
  const paleta = await response.json(); //retorna um json
  if (paleta.message != undefined) {
    //se o id não existir no banco de dados retorna uma mensagem de erro
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Paleta não encontrada!',
    });
    return; //retorna nada para não continuar a execução
  }
  document.querySelector('.List_all').style.display = 'block';
  document.querySelector('.Paleta_Lista').style.display = 'none'; //esconde a lista de paletas
  const paletaEscolhidaDiv = document.querySelector('#Chosed_Paleta'); //pega o elemento e intera como html
  paletaEscolhidaDiv.innerHTML = ` 
    <div class="Paleta_Card_Item" id="Paleta_Lista_Item_${paleta.id}">
    <div>
        <div class="Paleta_Card_Item__sabor">${paleta.sabor}</div>
        <div class="Paleta_Card_Item__preco">R$: ${paleta.preco}</div>
        <div class="Paleta_Card_Item__descricao">${paleta.descricao}</div>

        <div class="Paleta_Lista_Item_acoes acoes">
        <button class="Acoes_editar btn" onclick="show_Modal('${paleta._id}')" >Editar</button>
        <button class="Acoes_apagar btn" onclick="modal_delete('${paleta._id}')" >Apagar</button>
      </div>

    </div>
      <img class="Paleta_Card_Item__foto" src="${paleta.foto}" alt="${paleta.sabor}" />
</div>
`; //intera como html
}

async function show_Modal(id = '') {
  //abrir modal
  if (id != '') {
    //se o id for diferente de null
    document.querySelector('#Title_header_modal').innerText =
      'Atualizar Paleta'; //altera o titulo do modal
    document.querySelector('#Button_form_modal').innerText = 'Atualizar'; //altera o botão do modal
    const response = await fetch(`${baseURL}/paleta/${id}`); //fetch é uma função nativa do js com base na roda get by id no backend
    const paleta = await response.json(); //retorna um json
    document.querySelector('#sabor').value = paleta.sabor; //altera o valor do input para o valor do sabor da paleta
    document.querySelector('#preco').value = paleta.preco; //altera o valor do input para o valor do preco da paleta
    document.querySelector('#descricao').value = paleta.descricao; //altera o valor do input para o valor do descricao da paleta
    document.querySelector('#foto').value = paleta.foto; //altera o valor do input para o valor do foto da paleta
    document.querySelector('#id').value = paleta._id;
  } else {
    document.querySelector('#Title_header_modal').innerText =
      'Cadastrar Paleta'; //altera o titulo do modal de volta
    document.querySelector('#Button_form_modal').innerText = 'Cadastrar'; //altera o botão do modal de volta
  }

  document.querySelector('.Modal_overlay').style.display = 'flex'; //mostra o modal
}

function close_Modal() {
  //fechar modal
  document.querySelector('.Modal_overlay').style.display = 'none'; //esconde o modal
  document.querySelector('#sabor').value = ''; //altera o valor do input para vazio
  document.querySelector('#preco').value = 0; //altera o valor do input para 0
  document.querySelector('#descricao').value = ''; //altera o valor do input para vazio
  document.querySelector('#foto').value = ''; //altera o valor do input para vazio
  document.querySelector('#id').value = ''; //altera o valor do input para vazio
}

async function submit_Paleta(event) {
  //criar paleta
  const id = document.querySelector('#id').value;
  const sabor = document.querySelector('#sabor').value;
  const preco = document.querySelector('#preco').value;
  const descricao = document.querySelector('#descricao').value;
  const foto = document.querySelector('#foto').value;
  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };
  const modoEdicaoAtivado = id != ''; //se o id for maior que 0 então é modo edição
  const endpoint =
    baseURL + (modoEdicaoAtivado ? `/update/${id}` : `/create/${id}`); //se for modo edição, altera o endpoint para update, se não, altera para create

  const response = await fetch(endpoint, {
    //fetch é uma função nativa do js com base na roda post no backend
    method: modoEdicaoAtivado ? 'put' : 'post', //se for modo edição, altera o metodo para put, se não, altera para post
    headers: {
      'Content-Type': 'application/json', //tipo de conteudo enviado como json
    },
    mode: 'cors', //modo de acesso
    body: JSON.stringify(paleta), //conteudo enviado
  });

  const novaPaleta = await response.json(); //retorna um json
  modal_sucess(); //chama a função de cadastro sucesso
  page_refresh(); //atualiza a página
  close_Modal(); //fecha o modal
}

async function delete_Paleta(id) {
  //deleta a paleta
  const response = await fetch(`${baseURL}/delete/${id}`, {
    //fetch é uma função nativa do js com base na roda delete no backend
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  const result = await response.json(); //retorna um json
}

function modal_delete(id) {
  //modal para deletar a paleta
  Swal.fire({
    title: 'Atenção!',
    text: 'Tem certeza que deseja deletar a paleta?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02a6e7',
    cancelButtonColor: '#e70202',
    confirmButtonText: 'Sim, Deletar!',
  }).then((result) => {
    //se o usuário clicar em sim
    if (result.isConfirmed) {
      delete_Paleta(id);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Paleta Deletada!',
        showConfirmButton: false,
        timer: 3000,
      });
      page_refresh(); //atualiza a página
    }
  });
}

function modal_sucess() {
  //modal de cadastro/atualizar com sucesso
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Salvo com sucesso!',
    showConfirmButton: false,
    timer: 3000,
  });
}

function page_refresh() {
  //atualiza a página
  setTimeout(() => {
    document.location.reload(true);
  }, 1000); //atualiza a página em 1 segundo
}
