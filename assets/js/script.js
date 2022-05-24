const baseURL = 'http://localhost:3000/paletas'; //url base rodando em servidor local

async function findAllPaletas() {
  //no front end não é aconselhavel usar arrow
  const response = await fetch(`${baseURL}/all-paletas`); //fetch é uma função nativa do js

  const paletas = await response.json(); //retorna um json

  paletas.forEach(function (paleta) {
    //para cada paleta na lista será interada um elemento novo em html
    document.querySelector('#paletaList').insertAdjacentHTML(
      'beforeend',
      `
    <div class="PaletaListaItem" id="PaletaListaItem_${paleta._id}">
        <div>
            <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
            <div class="PaletaListaItem__preco">R$: ${paleta.preco}</div>
            <div class="PaletaListaItem__descricao">${paleta.descricao}</div>

            
             <div class="PaletaListaItem_acoes acoes">
                <button class="acoes-editar btn" onclick="abrirModal('${paleta._id}')">Editar</button>
                <button class="acoes-apagar btn" onclick="modal_deletar('${paleta._id}')">Apagar</button>
              </div>

        </div>

          <img class="PaletaListaItem__foto" src="${paleta.foto}" alt="${paleta.sabor}" />

    </div>
        `,
    );
  });
}
findAllPaletas(); //chama a função findAllPaletas() quando a página for carregada

async function findByIdPaletas() {
  //busca por id
  const id = document.querySelector('#idPaleta').value; //pega o valor do input

  const response = await fetch(`${baseURL}/paleta/${id}`); //fetch é uma função nativa do js com base na roda get by id no backend
  const paleta = await response.json(); //retorna um json

  const paletaEscolhidaDiv = document.querySelector('#paletaEscolhida'); //pega o elemento e intera como html

  paletaEscolhidaDiv.innerHTML = ` 
    <div class="PaletaCardItem" id="PaletaListaItem_${paleta.id}">
    <div>
        <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
        <div class="PaletaCardItem__preco">R$: ${paleta.preco}</div>
        <div class="PaletaCardItem__descricao">${paleta.descricao}</div>

        <div class="PaletaListaItem_acoes acoes">
        <button class="acoes-editar btn" onclick="abrirModal('${paleta._id}')">Editar</button>
        <button class="acoes-apagar btn" onclick="modal_deletar('${paleta._id}') >Apagar</button>
      </div>

    </div>
      <img class="PaletaCardItem__foto" src="${paleta.foto}" alt="${paleta.sabor}" />
</div>
`;
}

async function abrirModal(id = '') {
  //abrir modal

  if (id != '') {
    //se o id for diferente de null
    document.querySelector('#title-header-modal').innerText =
      'Atualizar Paleta'; //altera o titulo do modal

    document.querySelector('#button-form-modal').innerText = 'Atualizar'; //altera o botão do modal

    const response = await fetch(`${baseURL}/paleta/${id}`); //fetch é uma função nativa do js com base na roda get by id no backend
    const paleta = await response.json(); //retorna um json

    document.querySelector('#sabor').value = paleta.sabor; //altera o valor do input para o valor do sabor da paleta
    document.querySelector('#preco').value = paleta.preco; //altera o valor do input para o valor do preco da paleta
    document.querySelector('#descricao').value = paleta.descricao; //altera o valor do input para o valor do descricao da paleta
    document.querySelector('#foto').value = paleta.foto; //altera o valor do input para o valor do foto da paleta
    document.querySelector('#id').value = paleta._id;
  } else {
    document.querySelector('#title-header-modal').innerText =
      'Cadastrar Paleta'; //altera o titulo do modal de volta
    document.querySelector('#button-form-modal').innerText = 'Cadastrar'; //altera o botão do modal de volta
  }

  document.querySelector('.modal-overlay').style.display = 'flex'; //mostra o modal
}

function fecharModal() {
  //fechar modal
  document.querySelector('.modal-overlay').style.display = 'none'; //esconde o modal
  document.querySelector('#sabor').value = '';
  document.querySelector('#preco').value = 0;
  document.querySelector('#descricao').value = '';
  document.querySelector('#foto').value = '';
  document.querySelector('#id').value = '';
}

async function submitPaleta(event) {
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
  console.log(modoEdicaoAtivado);
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

  document.location.reload(true); //atualiza a página

  // if (modoEdicaoAtivado) {
  //   document.querySelector(`#PaletaListaItem_${id}`).outerHTML = html; //altera o html do elemento pelo html da nova paleta
  // } else {
  //   document.querySelector('#paletaList').insertAdjacentHTML('beforeend', html); //insere o html no html
  // }
  cadastrado_sucesso();
  fecharModal(); //fecha o modal
}

async function deletePaleta(id) {
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

  document.location.reload(true); //atualiza a página
}

function modal_deletar(id) {
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
      deletePaleta(id);
      Swal.fire('Deletada!', 'Paleta Deletada!', 'success');
    }
  });
}

function cadastrado_sucesso() {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Salvo com sucesso!',
    showConfirmButton: false,
    timer: 1500,
  });
}
