const $ = document.querySelector.bind(document);

$('#btnGravar').addEventListener("click", function() {
    const formData = getFormData();
    if(formData.id == "") {
        delete formData.id;
        pessoaService.create(response => {
            swal.fire('Sucesso!', response.mensagem, 'success').then(() => {
                setDataBinding();
            });
        }, formData);
    } else {
        pessoaService.edit(response => {
            swal.fire('Sucesso!', response.mensagem, 'success').then(() => {
                setDataBinding();
            });
        }, formData);
    }
});

setDataBinding();