const setDataBinding = function() {
    const dataBody = document.querySelector('#data-body');

    pessoaService.getAll(response => {
        limparElemento(dataBody);
        dataBody.innerHTML = getTableHTML(response);
    });
}

const limparElemento = function(el) {
    el.innerHTML = "";
}

const getTableHTML = function(dados) {
    return dados.map(data => getLineHTML(data)).join("");
}

const getLineHTML = function(row) {
    return `
        <tr>
            <td>${row.ID}</td>
            <td>${row.NOME}</td>
            <td>${row.EMAIL}</td>
            <td>${row.TIPO}</td>
            <td>
                <button type="button" class="btn btn-info" onclick="editContact(${row.ID})" data-role="editar">
                    Editar
                    <span class="fa fa-edit"></span>
                </button>
                <button type="button" class="btn btn-danger" onclick="deleteContact(${row.ID})" data-role="excluir">
                    Excluir
                    <span class="fa fa-trash"></span>
                </button>
            </td>
        </tr>
    `;
}

const editContact = function(id) {
    pessoaService.find(response => {
        response = response[0];
        $('#id').value = response.ID;
        $('#nome').value = response.NOME;
        $('#email').value = response.EMAIL;
        $('#tipo').value = response.TIPO;
    }, id);
}

const deleteContact = function(id) {
    swal.fire({
        title: 'Confirme',
        text: 'Você tem certeza? Essa ação não pode ser revertida.',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#dc3545',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            pessoaService.drop(response => {
                swal.fire('Sucesso!', response.mensagem, 'success').then(() => {
                    setDataBinding();
                });
            }, id);
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
}

const getFormData = function() {
    return {
        id: $('#id').value,
        nome: $('#nome').value,
        email: $('#email').value,
        tipo: $('#tipo').value
    };
}

const pessoaService = (function() {
    const API_URL = `https://wllsistemas.com.br/api/v2/public/pessoa/`;

    const objAjax = new XMLHttpRequest();

    const getAll = function(callback) {
        objAjax.open('GET', API_URL);
        objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        objAjax.send();
        iniciaLoad();
        objAjax.onload = () => {
            finalizaLoad();
            const response = JSON.parse(objAjax.responseText);
            callback(response);
        }
    }

    const find = function(callback, id) {
        objAjax.open('GET', API_URL + id);
        objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        objAjax.send();
        iniciaLoad();
        objAjax.onload = () => {
            finalizaLoad();
            const response = JSON.parse(objAjax.responseText);
            callback(response);
        }
    }
    
    const create = function(callback, data) {
        objAjax.open('POST', API_URL, true);
        objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        objAjax.send(`nome=${data.nome}&email=${data.email}&tipo=${data.tipo}`);
        iniciaLoad();
        objAjax.onload = () => {
            finalizaLoad();
            const response = JSON.parse(objAjax.responseText);
            callback(response);
            limparCampos();
        }
    }
    
    const edit = function(callback, data) {
        objAjax.open('PUT', `${API_URL}`);
        objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        objAjax.send(`id=${data.id}&nome=${data.nome}&email=${data.email}&tipo=${data.tipo}`);
        iniciaLoad();
        objAjax.onload = () => {
            finalizaLoad();
            const response = JSON.parse(objAjax.responseText);
            callback(response);
            limparCampos();
        }
    }
    
    const drop = function(callback, id) {
        objAjax.open('DELETE', `${API_URL}${id}`);
        objAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        objAjax.send();
        iniciaLoad();
        objAjax.onload = () => {
            finalizaLoad();
            const response = JSON.parse(objAjax.responseText);
            callback(response);
        }
    }

    return {
        getAll,
        find,
        create,
        edit,
        drop
    };
    
})();

const iniciaLoad = function() {
    $('#loader').style.display = "flex";
}
const finalizaLoad = function() {
    $('#loader').style.display = "none";
}

const limparCampos = function() {
    $('#id').value = "";
    $('#nome').value = "";
    $('#email').value = "";
    $('#tipo').value = "";
}