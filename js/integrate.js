function setTitle(title= ''){
    $('.title-page').html(title);
}
function initFontes(){
    $.ajax({
        url: 'https://newsapi.org/v2/sources?language=pt&country=br&apiKey=849a73de9f724d84afd5a4df9040477f',
    }).done((data)=>{
        if (data.status == 'ok') {
            let fontes = data.sources;
            let retorno = '';
            fontes.map((i) => {
                retorno += '<li><a class="fonte" data-title="Notícias da fonte: ' + i.name + '" data-fonte="' + i.id + '" href="?sources=' + i.id + '">' + i.name + '</a></li>';
            });
            $('.fontes').html(retorno);
        } else {source
            console.log('Erro ao encontrar fontes');
        }
    });
}

function initBanner(data){
    let retorno;

    data.map((i,j)=>{
        if(j == 0)
            retorno += '<div class="carousel-item active" style="background-position: center;background-size: cover;height:300px;background-image:url(\'' + i.urlToImage + '\')">';
        else
            retorno += '<div class="carousel-item" style="background-position: center;background-size: cover;height:300px;background-image:url(\'' + i.urlToImage + '\')">';

        //retorno += '<img src="' + i.urlToImage + '" class="img-responsive" alt="">=</img>';
        retorno += '    <h1 class="text-center title-banner mt-5" >' + i.title + '</h1 >'
        retorno +='</div >';
    });

    $(".carousel-inner").html(retorno);
    $('#banner').css('display', 'block');
}

function searchNoticias(q=''){
    $('#banner').css('display', 'none');
    $.ajax({
        url: 'https://newsapi.org/v2/everything?q=' + q + '&apiKey=849a73de9f724d84afd5a4df9040477f&pageSize=10&language=pt',
    }).done((data) => {
        if (data.status == 'ok') {
            let destaques = data.articles;
            let retorno = '';
            destaques.map((i) => {
                retorno += '<div class="single featured row">';
                retorno += '    <div class="col-md-6">';
                retorno += '        <div class="img">';
                retorno += '            <img src="' + i.urlToImage + '" class="gray-border img-example" alt="">';
                retorno += '        </div>';
                retorno += '    </div>';
                retorno += '    <div class="col-md-6">';
                retorno += '        <h4 class="my-0">Data da publicação: ' + moment(i.publishedAt).format('DD/MM/YYYY - HH:mm') + '</h4>';
                retorno += '        <h1 class="my-2"><a target="_blank" href="'+i.url+'">' + i.title + '</a></h1>';
                retorno += '        <p class="my-0 text-justify">' + i.description + '</p>';
                retorno += '        <small class="mt-3">Fonte da notícia: ' + i.source.name + '</small>';
                retorno += '    </div>';
                retorno += '</div>';
            });

            $('.featureds').html('');
            $('.noticias-list').html(retorno);
            setTitle('Busca por: "' + q + '"' + buttonSave());
            window.history.pushState('data', 'Buscando por : ' + q, window.location.pathname + '?q=' + q);
        } else {
            console.log('Erro ao encontrar fontes');
        }
    });
}
function getDestaques(page = 1, categoria = '',fonte = '',home = false){
    if(categoria != null && categoria != ''){
        categoria = '&country=br&category=' + categoria
    }else{
        categoria = '';
    }
    if(fonte != null && fonte != ''){
        fonte = '&sources='+fonte;
    }else{
        fonte = '';
    }
    if(categoria != '' || fonte != ''){
        home = false;
    }
    if (categoria == '' && fonte == '' || categoria == 'general' && fonte == '' || categoria == '&country=br&category=general'){
        home = true;
        categoria = '&country=br';
    }
    if(fonte != ''){
        categoria = '';
    }
    $.ajax({
        url: 'https://newsapi.org/v2/top-headlines?apiKey=849a73de9f724d84afd5a4df9040477f&pageSize=15&page=' + page + categoria + fonte
    }).done((data) => {
        if (data.status == 'ok') {
            let destaques = data.articles;
            let retorno = '';
            let first = '';

            if (home == true){
                let banners = destaques;
                banners = banners.slice(0, 3);
                initBanner(banners);
            }else{
                $('#banner').css('display','none');
            }
            destaques.map((i,j) => {
                if(j == 0 && page == 1){
                    retorno += '<div class="single featured row">';
                    retorno += '    <div class="col-md-6">';
                    retorno += '        <div class="img">';
                    retorno += '            <span class="label-exclusive">Novidade</span>';
                    retorno += '            <img src="' + i.urlToImage + '" class="gray-border img-example" alt="">';
                    retorno += '        </div>';
                    retorno += '    </div>'; 
                    retorno += '    <div class="col-md-6">';
                    retorno += '        <h4 class="my-0">Data da publicação: ' + moment(i.publishedAt).format('DD/MM/YYYY - HH:mm') + '</h4>';
                    retorno += '        <h1 class="my-2"><a target="_blank" href="' + i.url +'">' + i.title + '</a></h1>';
                    retorno += '        <p class="my-0 text-justify">' + i.description  + '</p>';
                    retorno += '    </div>';
                    retorno += '</div>';
                    first = retorno;
                    retorno = '';
                }else{
                    
                    retorno += '<div class="col-md-6 mb-5">';
                    retorno += '    <div class="single-img-top">';
                    retorno += '        <h4 class="my-0">Data da publicação: ' + moment(i.publishedAt).format('DD/MM/YYYY - HH:mm') + '</h4>';
                    retorno += '        <img src="' + i.urlToImage + '" alt="" class="mt-1">';
                    retorno += '        <h1 class="my-2 text-justify"><a target="_blank" href="' + i.url +'">' + i.title + '</a></h1>';
                    retorno += '        <p class="my-0 text-justify">' + i.description + '</p>';
                    retorno += '    </div>';
                    retorno += '</div>';
                }
                
            });
            
            $('.featureds').html(first);
            $('.noticias-list').html(retorno);
        } else {
            console.log('Erro ao encontrar fontes');
        }
    });
}
function buttonSave(){
    return '<button class="btn ml-3 btn-primary btn-sm" data-toggle="modal" data-target="#addPesquisaModal" onclick="openModal()">Salvar pesquisa</button>';
}

function refreshSearch(){
    let data = JSON.parse(localStorage.getItem('pesquisa'));
    let content = '<ul class="list-inline">';
    if(!data){
        content += '<li><small>Nenhuma pesquisa salva</small></li>';
    }else{
        data.map((item,index)=>{
            content += '<li style="margin-top:10px;"><a href="#" onclick="searchNoticias(\'' + item.texto + '\')">' + item.titulo +'</a><a onclick="deleteSearch(\''+index+'\')" style="margin-top: -5px;color:#fff" class="btn btn-sm btn-danger float-right">x</a></li>';
        });
    }
    content += '</ul>';
    $("#pesquisas_salvas").html(content);
}
function openModal(){
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('q');
    if (search){
        $("#texto_pesquisa").val(search);
    }
    let id = $(this).attr('data-target');
    $(id).modal('show');
}
function deleteSearch(index = null){
    let data = JSON.parse(localStorage.getItem('pesquisa'));
    let newData = [];
    if (data) {
        data.map((item,i)=>{
            if(i != index)
                newData.push(item);
        })
        localStorage.setItem('pesquisa', JSON.stringify(newData));
        refreshSearch();
    }
}
function saveSearch(){

    let titulo_pesquisa = $("#titulo_pesquisa").val();
    let texto_pesquisa = $("#texto_pesquisa").val();
    if (!titulo_pesquisa || !texto_pesquisa){
        alert('Preencha o todos campos!');
    }else{
        let search = {
            'titulo': titulo_pesquisa,
            'texto' : texto_pesquisa
        }
        let pesquisas = [];
        if(localStorage.getItem('pesquisa')){
            pesquisas = JSON.parse(localStorage.getItem('pesquisa'));
        }
        pesquisas.push(search);
        localStorage.setItem('pesquisa', JSON.stringify(pesquisas));
        refreshSearch();
        $("#titulo_pesquisa").val('');
        $("#addPesquisaModal").modal('hide');
    }
    
}
function resetActived(){
    $('.active-link').each(function(){
        $(this).removeClass('active-link');
    });
}

$(document).ready(()=>{
    refreshSearch();
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    const sources = urlParams.get('sources');
    const search = urlParams.get('q');

    initFontes();
    if (search != null && search!= ''){
        searchNoticias(search);
    }else{
        getDestaques(1, categoria, sources);
    }

    $('.search').on('submit',function(e){
        e.preventDefault();
        var q = $('#search-input').val();
        if(q!= ''){
            searchNoticias(q);
        }
    });
    $(".categoria").click(function(e){
        e.preventDefault();
        resetActived();
        $(this).addClass('active-link');
        let categoria = $(this).attr('data-category');
        getDestaques(1, categoria);
        window.history.pushState('data', 'Filtrado por categoria: ' + categoria, window.location.pathname + '?categoria=' + categoria);
        setTitle($(this).attr('data-title'));
        $('#search-input').val('');
    });

    $("body").delegate(".fonte", "click", function (e) {
        resetActived();
        $(this).addClass('active-link');
        e.preventDefault();
        let fonte = $(this).attr('data-fonte');
        getDestaques(1, '', fonte);
        window.history.pushState('data', 'Filtrado por categoria fonte: ' + fonte, window.location.pathname + '?sources=' + fonte);
        setTitle($(this).attr('data-title'));
        $('#search-input').val('');
    })
    
});