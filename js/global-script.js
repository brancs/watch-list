const sectionsIDs = ['#home', '#addNewAnime', '#importExportList'];

let myAnimes = { animes: [] };

if (localStorage.getItem('myAnimesJson')) {
    myAnimes = JSON.parse(localStorage.getItem('myAnimesJson'));
    console.log(myAnimes);
}


function init() {
    //hide clear search button 
    $('#btn-clear-search').hide();

    //get and show animes
    showMyAnimes(myAnimes);

    //Hide all content when init
    for (let contentIndex = 1; contentIndex <= sectionsIDs.length - 1; contentIndex++) {
        $(sectionsIDs[contentIndex]).hide();
    }
}

//------------------------------------------- PAGE CONTENTS CONTROLER START --------------------------------------------

//Show selected content
function showContent(contentID) {
    $('.content').hide();
    $(contentID).show();

    if (contentID == '#home') {
        $('#nav-import').removeClass('active');
        $('#nav-add').removeClass('active');
        $('#nav-home').addClass('active');
    } else if (contentID == '#addNewAnime') {
        $('#nav-home').removeClass('active');
        $('#nav-import').removeClass('active');
        $('#nav-add').addClass('active');
    }else if (contentID == '#importExportList') {
        $('#nav-home').removeClass('active');
        $('#nav-add').removeClass('active');
        $('#nav-import').addClass('active');
    } else {
        $('#nav-home').removeClass('active');
        $('#nav-add').removeClass('active');
        $('#nav-import').remmoveClass('active');
    }
}

//------------------------------------------- PAGE CONTENTS CONTROLER END --------------------------------------------



//------------------------------------------- ADD, REMOVE AND EDIT LIST DATA START --------------------------------------------

//Add new anime
function addNewAnime() {
    let newAnimeName = $('#newAnimeName').val();
    let newAnimeUrl = $('#newAnimeUrl').val();
    let newAnimeImgUrl = $('#newAnimeIMG').val();
    let newAnimeTotalNumOfEps = $('#newAnimeTotalNumOfEps').val();
    let newAnimeWatch = $('input[name="newAnimeWatch"]:checked').val();
    let newAnimeActualEp = $('#newAnimeActualEp').val();
    let newAnimeAlreadyWatched;
    let newAnimeWatching;

    let date = new Date();
    let newMillis = date.getTime();

    if (newAnimeWatch == 'watching') {
        newAnimeAlreadyWatched = false;
        newAnimeWatching = true;
    } else {
        newAnimeAlreadyWatched = true;
        newAnimeWatching = false;
    }

    let anime = {
        id: newMillis.toString(),
        name: newAnimeName,
        url: newAnimeUrl,
        imgUrl: newAnimeImgUrl,
        totalNumEps: newAnimeTotalNumOfEps,
        watching: newAnimeWatching,
        actualEp: newAnimeActualEp,
        watched: newAnimeAlreadyWatched
    };

    myAnimes.animes.push(anime);

    console.log('New anime added! ', newAnimeWatch);

    savingAnimeFile();
    showMyAnimes(myAnimes);
    showContent('#home');
}

//Add new anime control validation
function validationAddNewAnimeRadios(){
    if($('#newAnimeWatching').is(':checked')){
        $('#newAnimeActualEpGroup').removeClass('d-none');
    }else{
        if(!$('#newAnimeActualEp').hasClass('d-none')){
            $('#newAnimeActualEpGroup').addClass('d-none');
        }
    }
}

//Edit anime
function editAnime(animeID) {

    //myAnimes.animes.push(anime);

    let animeIndex = myAnimes.animes.findIndex((obj => obj.id == animeID));

    let inputEpId= '#newEpValueTo-'+ animeID;

    //let novoEp = $(inputEpId).val();
    if($(inputEpId).val()){
        myAnimes.animes[animeIndex].actualEp = $(inputEpId).val();
    }

    if(myAnimes.animes[animeIndex].actualEp == myAnimes.animes[animeIndex].totalNumEps){
        myAnimes.animes[animeIndex].watched = true;
    }

    console.log('Anime ' + animeID + ' edited! ');

    savingAnimeFile();
    showMyAnimes(myAnimes);
}


//Remove anime
function removeAnime(animeID) {

    //myAnimes.animes.push(anime);

    console.log('Anime ' + animeID + ' removed!');

    if (animeID !== undefined) myAnimes.animes.splice(animeID, 1);

    //console.log("After removal:", myAnimes.animes);

    savingAnimeFile();
    showMyAnimes(myAnimes);
}
//------------------------------------------- ADD, REMOVE AND EDIT LIST DATA END --------------------------------------------



//------------------------------------------- SEARCH LIST DATA START --------------------------------------------

//Search an clear search

function searchInList(filter) {

    if($('#watchedAnimes').is(':checked')){
        filters['watched']();
    }else if($('#watchingAnimes').is(':checked')){
        filters['watching']();
    }else{
        filters[filter]();
    }

    if ($('#myAnimes').is(':empty')){
        $('#myAnimes').append('<div class="col-12 col-sm-6 col-lg-4">Nada encontrado :(</div>');
    }


}

function clearSearch() {
    $('#searchAnimeName').val("");
    showMyAnimes(myAnimes);
    $('#btn-search').show();
    $('#btn-clear-search').hide();
}

const filters = {
    all: function(){
        showMyAnimes(myAnimes);
    },
    name : function (){
        $('#myAnimes').empty();

        $('#animeSpinner').removeClass('d-none');

        let indexCounter = 0;
        let searchField = $('#searchAnimeName').val();

        if(!searchField){
            $('#btn-clear-search').hide();
            $('#btn-search').show();
            showMyAnimes(myAnimes);
            $('#animeSpinner').addClass('d-none');
        }else{
            
            let expression = new RegExp(searchField, "i");

            $.each(myAnimes.animes, function (key, val) {
                if (val.name.search(expression) != -1) {
                    //console.log('Anime name: ', anime);
                    //'<br>Watching: '+ anime.watching +'<br>Actual Episode: '+ anime.actualEp;
                    if (myAnimes.animes == null) {
                        return false;
                    } else {

                        $('#myAnimes').append(makeAnimeCard(val, indexCounter));

                        indexCounter++;

                        $('#animeSpinner').addClass('d-none');
                    }
                }
            });
            
            $('#btn-search').hide();
            $('#btn-clear-search').show();
        }
    },
    watched : function (){

        $('#myAnimes').empty();

        $('#animeSpinner').removeClass('d-none');

        let indexCounter = 0;
        let searchField = $('#searchAnimeName').val();

        if($('#watchedAnimes').is(':checked') && !searchField){

            $.each(myAnimes.animes, function (key, val) {
                if (val.watched) {
                    //console.log('Anime name: ', anime);
                    //'<br>Watching: '+ anime.watching +'<br>Actual Episode: '+ anime.actualEp;
                    if (myAnimes.animes == null) {
                        return false;
                    } else {
                        
                        $('#myAnimes').append(makeAnimeCard(val, indexCounter));

                        indexCounter++;

                        $('#animeSpinner').addClass('d-none');
                    }
                }
            });
        
        }else if($('#watchedAnimes').is(':checked') && searchField){

            let expression = new RegExp(searchField, "i");

            $.each(myAnimes.animes, function (key, val) {
                if (val.watched && val.name.search(expression) != -1) {
                    //console.log('Anime name: ', anime);
                    //'<br>Watching: '+ anime.watching +'<br>Actual Episode: '+ anime.actualEp;
                    if (myAnimes.animes == null) {
                        return false;
                    } else {
                        
                        $('#myAnimes').append(makeAnimeCard(val, indexCounter));

                        indexCounter++;

                        $('#animeSpinner').addClass('d-none');
                    }
                }
            });

        } else if(!$('#watchedAnimes').is(':checked')){
            filters['name']();
        }else{
            showMyAnimes(myAnimes);
            $('#animeSpinner').addClass('d-none');
        }
    },
    watching : function (){

        $('#myAnimes').empty();

        $('#animeSpinner').removeClass('d-none');

        let indexCounter = 0;
        let searchField = $('#searchAnimeName').val();

        if($('#watchingAnimes').is(':checked') && !searchField){

            $.each(myAnimes.animes, function (key, val) {
                if (val.watching && !val.watched) {
                    //console.log('Anime name: ', anime);
                    //'<br>Watching: '+ anime.watching +'<br>Actual Episode: '+ anime.actualEp;
                    if (myAnimes.animes == null) {
                        return false;
                    } else {
                        
                        $('#myAnimes').append(makeAnimeCard(val, indexCounter));

                        indexCounter++;

                        $('#animeSpinner').addClass('d-none');
                    }
                }
            });
        
        }else if($('#watchingAnimes').is(':checked') && searchField){

            let expression = new RegExp(searchField, "i");

            $.each(myAnimes.animes, function (key, val) {
                if (val.watching && !val.watched && val.name.search(expression) != -1) {
                    //console.log('Anime name: ', anime);
                    //'<br>Watching: '+ anime.watching +'<br>Actual Episode: '+ anime.actualEp;
                    if (myAnimes.animes == null) {
                        return false;
                    } else {
                        
                        $('#myAnimes').append(makeAnimeCard(val, indexCounter));

                        indexCounter++;

                        $('#animeSpinner').addClass('d-none');
                    }
                }
            });

        } else if(!$('#watchingAnimes').is(':checked')){
            filters['name']();
        }else{
            showMyAnimes(myAnimes);
            $('#animeSpinner').addClass('d-none');
        }
    }
};

//------------------------------------------- SEARCH LIST DATA END --------------------------------------------



//------------------------------------------- SHOWING LIST DATA START --------------------------------------------

//Show your watch list

function showMyAnimes(myAnimes) {
    $('#myAnimes').empty();
    $('#animeSpinner').removeClass('d-none');
    let indexCounter = 0;
    if (myAnimes.animes == null) {
        return false;
    } else {
        for (anime of myAnimes.animes) {

            $('#myAnimes').append(makeAnimeCard(anime, indexCounter));

            indexCounter++;
        }
    }
    $('#animeSpinner').addClass('d-none');
    // calculateSomeCoolData(myAnimes);
}


function makeAnimeCard(anime, indexCounter){

    if(anime.actualEp == anime.totalNumEps){
        anime.watched = true;
    }

    let AnimeCardHtml;

    if (anime.imgUrl != undefined) {
        AnimeCardHtml = `<div class="col-12 col-sm-6 col-lg-4"><div class="card mb-3"> <div class="row no-gutters"> <div class="col-md-4"> <div class="card-img" style="background-image: url('`+ anime.imgUrl +`');"></div></div><div class="col-md-8"> <div class="card-body"><h5>` + anime.name + `</h5><br>Total Episodes: ` + anime.totalNumEps;
    } else {
        AnimeCardHtml = '<div class="card mb-3"> <div class="row no-gutters"><div class="col-md-12"> <div class="card-body">Name: ' + anime.name + '<br>Total Episodes: ' + anime.totalNumEps;
    }

    if (anime.watching && !anime.watched) {
        AnimeCardHtml += '<br>Last episode watched: <input id="newEpValueTo-'+ anime.id +'" type="number" style="width: 65px;" placeholder="' + anime.actualEp + '">';
    }

    if (anime.watched) {
        AnimeCardHtml += `<br>Watched!<br><br><button class="btn btn-danger" onclick="removeAnime(` + indexCounter + `)"><span class="material-icons" style="font-size: 18px;">delete</span></button></div> </div> </div> </div></div>`;
    }else{
        AnimeCardHtml += `<br><br><a class="btn btn-info" href='`+ anime.url +`' target='_blank'><span class="material-icons" style="font-size: 18px;">launch</span></a>&nbsp;&nbsp;<button class="btn btn-primary" onclick="editAnime('` + anime.id + `')"><span class="material-icons" style="font-size: 18px;">save</span></button>&nbsp;&nbsp;<button class="btn btn-danger" onclick="removeAnime(` + indexCounter + `)"><span class="material-icons" style="font-size: 18px;">delete</span></button></div> </div> </div> </div></div>`;
    }

    return AnimeCardHtml;
}

//Caculate dashboard data: Totals about my animes
/*function calculateSomeCoolData(myAnimes){

    let totalAnimesToWatch = 0;
    let totalAnimesImWatching = 0;
    let totalAnimesIveWatched = 0;
    let totalEpisodesIveWatched = 0;

    if (myAnimes.animes == null) {
        return false;
    }else{
        for(anime of myAnimes.animes){

            if(!anime.watched && !anime.watching){
                totalAnimesToWatch += 1;
            }else if(!anime.watched && anime.watching){
                totalAnimesImWatching += 1;
            }
            else{
                totalAnimesIveWatched += 1;
                totalEpisodesIveWatched += parseInt(anime.totalNumEps);
            }
    
        }
    }

    $('#totalAnimesToWatch').empty().append(totalAnimesToWatch);
    $('#totalAnimesImWatching').empty().append(totalAnimesImWatching);
    $('#totalAnimesIveWatched').empty().append(totalAnimesIveWatched);
    $('#totalEpisodesIveWatched').empty().append(totalEpisodesIveWatched);

}*/

//------------------------------------------- SHOWING LIST DATA END --------------------------------------------



//------------------------------------------- SAVING AND GETTING LIST DATA START --------------------------------------------

//Save archive on localStorage (Google Drive in future)
function savingAnimeFile() {
    //saving on localstorage
    //console.log(JSON.stringify(myAnimes));

    localStorage.setItem('myAnimesJson', JSON.stringify(myAnimes));

    console.log('Saving your anime data!');
}

//Export list
function exportAnimeFile() {
    const exportLink = document.createElement("a");
    exportLink.href = URL.createObjectURL(new Blob([JSON.stringify(myAnimes, null, 2)], {type: "application/json"}));
    exportLink.setAttribute("download", "myWatchListData.json");
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);

    console.log('Exporting your anime data!');
}

//Import list
function importAnimeFile() {

    let file = document.getElementById('importJsonFile').files[0];

    let testeanimes;

    let reader = new FileReader();

    reader.onload = function () { 
        try {
            myAnimes = JSON.parse(reader.result);
            console.log('file: ', file ,'\nEspected: ', reader.result, '\n Var: ', myAnimes);
            
            savingAnimeFile();
            showMyAnimes(myAnimes);
        }
        catch (ex) {
            alert('Exception: ', ex);
        } 
    };

    reader.readAsText(file);

    showContent('#home');

}

//Get archive from Google Drive
function gettingAnimeFile() {
    console.log('Getting your anime data!');
}

//------------------------------------------- SAVING AND GETTING LIST DATA END --------------------------------------------


// Initializing
init();

