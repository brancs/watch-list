
let myAnimes = { animes: [] };

if (localStorage.getItem('myAnimesJson')) {
    myAnimes = JSON.parse(localStorage.getItem('myAnimesJson'));
    //console.log(myAnimes);
}


function init() {
    //hide clear search button 
    $('#btn-clear-search').hide();

    let onlyShow = myAnimes;

    onlyShow.animes.sort(function(a, b) {
        var animeNameA = a.name.toLowerCase(), animeNameB = b.name.toLowerCase();

        console.log(animeNameA, animeNameB);

        if (animeNameA < animeNameB){
            return -1;
        }

        if (animeNameA > animeNameB){
            return 1;
        }
        
        return 0;

    });

    //get and show animes
    showMyAnimes(onlyShow);
    console.log('ONLY SHOW');

}



//------------------------------------------- ADD, REMOVE AND EDIT LIST DATA START --------------------------------------------

//Add new anime
function addNewAnime() {
    if(!$('#newAnimeName').val()){
        alert('Please enter the name!');
        return false;
    }else{
        let newAnimeName = $('#newAnimeName').val();
        let newAnimeUrl = $('#newAnimeUrl').val();
        let newAnimeImgUrl = $('#newAnimeIMG').val();
        let newAnimeWatch = $('input[name="newAnimeWatch"]:checked').val();
        let newAnimeActualEp = $('#newAnimeActualEp').val();
        let newAnimeTotalNumOfEps;
        let newAnimeAlreadyWatched;
        let newAnimeWatching;

        if($('#inputAddAnimeTotalNumEpsUndefined').is(':checked')){
            newAnimeTotalNumOfEps = 'Undefined';
        }else{
            newAnimeTotalNumOfEps = $('#newAnimeTotalNumOfEps').val();
        }

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

        //console.log('New anime added! ', newAnimeWatch);


        savingAnimeFile();

    }
}

function validationAdd(fieldName, fieldHelperName){
    if(!$(fieldName).val()){
        $(fieldName).removeClass('border border-success');
        $(fieldName).addClass('border border-danger');
        if($(fieldHelperName).hasClass('d-none')){
            $(fieldHelperName).removeClass('d-none');
        }
        //console.log('nome n tem valor');
        return false;
    }else{
        $(fieldName).removeClass('border border-danger');
        $(fieldName).addClass('border border-success');
        if(!$(fieldHelperName).hasClass('d-none')){
            $(fieldHelperName).addClass('d-none');
        }
        //console.log('nome tem valor');
        return true;
    }
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

//Save actual ep anime
function saveAnimeEp(animeID, op) {

    //myAnimes.animes.push(anime);

    let animeIndex = myAnimes.animes.findIndex((obj => obj.id == animeID));

    if(op == 'plus'){

        myAnimes.animes[animeIndex].actualEp++;

        if(myAnimes.animes[animeIndex].actualEp == myAnimes.animes[animeIndex].totalNumEps){
            myAnimes.animes[animeIndex].watched = true;
        }

    }else if(op == 'minus'){

        myAnimes.animes[animeIndex].actualEp--;

        if(myAnimes.animes[animeIndex].actualEp < 0){
            myAnimes.animes[animeIndex].actualEp = 0;
        }

        if(myAnimes.animes[animeIndex].actualEp == myAnimes.animes[animeIndex].totalNumEps){
            myAnimes.animes[animeIndex].watched = true;
        }

    }

    //console.log('Anime ' + animeID + ' edited! ');

    savingAnimeFile();
    showMyAnimes(myAnimes);

}

//Edit anime modal
function openEditModal(animeID){

    let animeIndex = myAnimes.animes.findIndex((obj => obj.id == animeID));

    $('#editAnimeModalLabel').html("Editing " + myAnimes.animes[animeIndex].name);

    $('#inputEditAnimeName').val(myAnimes.animes[animeIndex].name);
    $('#inputEditAnimeImgUrl').val(myAnimes.animes[animeIndex].imgUrl);
    $('#inputEditAnimeUrl').val(myAnimes.animes[animeIndex].url);
    $('#inputEditAnimeTotalNumEps').val(myAnimes.animes[animeIndex].totalNumEps);
    $('#inputEditAnimeActualEp').val(myAnimes.animes[animeIndex].actualEp);

    if(myAnimes.animes[animeIndex].watched){
        $( "#editAnimeAlreadyWatched" ).prop( "checked", true );
        $( "#editAnimeWatching" ).prop( "checked", false );
    }else{
        $( "#editAnimeWatching" ).prop( "checked", true );
        $( "#editAnimeAlreadyWatched" ).prop( "checked", false );
    }

    if(myAnimes.animes[animeIndex].totalNumEps === 'Undefined'){
        $( "#inputEditAnimeTotalNumEpsUndefined" ).prop( "checked", true );
        $('#inputEditAnimeTotalNumEps').hide();
    }else{
        $( "#inputEditAnimeTotalNumEpsUndefined" ).prop( "checked", false );
        $('#inputEditAnimeTotalNumEps').show();
    }

    if($('#editAnimeWatching').is(':checked')){
        $('#editAnimeActualEpGroup').removeClass('d-none');
    }else{
        if(!$('#editAnimeActualEp').hasClass('d-none')){
            $('#editAnimeActualEpGroup').addClass('d-none');
        }
    }

    $('#editAnimeModal-footer').html(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button type="button" onclick="editAnime('` + animeIndex + `')" class="btn btn-primary">Save changes</button>`);

    $('#editAnimeModal').modal('show');
}

//Edit anime
function editAnime(animeIndex){

    //console.log('Actual Total Eps: ' + myAnimes.animes[animeIndex].totalNumEps);
    //console.log('New Actual Total Eps: ' + $("#inputEditAnimeTotalNumEps").val());

    if($(inputEditAnimeName).val()){
        myAnimes.animes[animeIndex].name = $("#inputEditAnimeName").val();
    }

    if($(inputEditAnimeName).val()){
        myAnimes.animes[animeIndex].imgUrl = $("#inputEditAnimeImgUrl").val();
    }

    if($(inputEditAnimeUrl).val()){
        myAnimes.animes[animeIndex].url = $("#inputEditAnimeUrl").val();
    }

    if($('#inputEditAnimeTotalNumEpsUndefined').is(':checked')){
        myAnimes.animes[animeIndex].totalNumEps = 'Undefined';
    }else{
        if($(inputEditAnimeTotalNumEps).val()){
            myAnimes.animes[animeIndex].totalNumEps = $("#inputEditAnimeTotalNumEps").val();
        }
    }

    if($('#editAnimeWatching').is(':checked')){
        myAnimes.animes[animeIndex].watching = true;
        myAnimes.animes[animeIndex].watched = false;
        if($(inputEditAnimeActualEp).val()){
            myAnimes.animes[animeIndex].actualEp = $("#inputEditAnimeActualEp").val();
        }
    }else{
        if($('#editAnimeAlreadyWatched').is(':checked')){
            myAnimes.animes[animeIndex].watching = false;
            myAnimes.animes[animeIndex].watched = true;
        }
    }
    
    

    
    

    //console.log('Anime ' + animeIndex + ' edited! ');

    savingAnimeFile();
    showMyAnimes(myAnimes);

    $('#inputEditAnimeName').val('');
    $('#inputEditAnimeImgUrl').val('');
    $('#inputEditAnimeUrl').val('');
    $('#inputEditAnimeTotalNumEps').val('');
    $('#inputEditAnimeActualEp').val('');
    $( "#inputEditAnimeTotalNumEpsUndefined" ).prop( "checked", false );

    $('#editAnimeModal').modal('hide');
}


//Add new anime control validation
function validationEditNewAnimeRadios(){
    if($('#editAnimeWatching').is(':checked')){
        $('#editAnimeActualEpGroup').removeClass('d-none');
    }else{
        if(!$('#editAnimeActualEp').hasClass('d-none')){
            $('#editAnimeActualEpGroup').addClass('d-none');
        }
    }
}

//validation edit Total undefined
function validationUndefined(form){
    if(form === 'add'){
        if($('#inputAddAnimeTotalNumEpsUndefined').is(':checked')){
            $('#newAnimeTotalNumOfEps').hide();
        }else{
            $('#newAnimeTotalNumOfEps').show();
        }
    }else if('edit'){
        if($('#inputEditAnimeTotalNumEpsUndefined').is(':checked')){
            $('#inputEditAnimeTotalNumEps').hide();
        }else{
            $('#inputEditAnimeTotalNumEps').show();
        }
    }else{

    }
}

function openRemoveModal(animeID, indexCounter){

    let animeIndex = myAnimes.animes.findIndex((obj => obj.id == animeID));

    $('#removeAnimeModalLabel').html("Removing " + myAnimes.animes[animeIndex].name);

    $('#removeAnimeModal-footer').html(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button type="button" onclick="removeAnime('` + indexCounter + `')" class="btn btn-primary">Remove</button>`);

    $('#removeAnimeModal').modal('show');
}

//Remove anime
function removeAnime(indexCounter) {

    //myAnimes.animes.push(anime);

    //console.log('Anime ' + indexCounter + ' removed!');

    if (indexCounter !== undefined) myAnimes.animes.splice(indexCounter, 1);

    ////console.log("After removal:", myAnimes.animes);

    savingAnimeFile();
    showMyAnimes(myAnimes);
    $('#removeAnimeModal').modal('hide');
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
                    ////console.log('Anime name: ', anime);
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
                    ////console.log('Anime name: ', anime);
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
                    ////console.log('Anime name: ', anime);
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
                    ////console.log('Anime name: ', anime);
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
                    ////console.log('Anime name: ', anime);
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

function showMyAnimes(onlyShow) {
    $('#myAnimes').empty();
    $('#animeSpinner').removeClass('d-none');
    let indexCounter = 0;
    if (onlyShow.animes == null) {
        return false;
    } else {
        for (anime of onlyShow.animes) {

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

    if (anime.imgUrl) {
        AnimeCardHtml = `<div class="col-12 col-lg-4"><div class="card mb-3"> <div class="row card-mins-height no-gutters"> <div class="col-4"> <div class="card-img" style="background-image: url('`+ anime.imgUrl +`');"></div></div><div class="col-8"> <div class="card-body"><h5 class="mb-0 text-truncate">` + anime.name + `</h5><br>Total Episodes: ` + anime.totalNumEps + `<br>`;
    } else {
        AnimeCardHtml = '<div class="col-12 col-lg-4"><div class="card mb-3"> <div class="row card-mins-height no-gutters"><div class="col-12"> <div class="card-body"> <h5 class="mb-0 text-truncate">' + anime.name + '</h5>Total Episodes: ' + anime.totalNumEps;
    }

    if (anime.watching && !anime.watched) {
        AnimeCardHtml += `<br>Last episode watched:<br> <button class="btn btn-secondary" style="padding: 1px 6px !important;" onclick="saveAnimeEp('` + anime.id + `', 'minus')"><span class="material-icons" style="font-size: 18px;">remove</span></button> &nbsp; <span>`+ anime.actualEp +`</span> &nbsp; <button class="btn btn-dark" style="padding: 1px 6px !important;" onclick="saveAnimeEp('` + anime.id + `', 'plus')"><span class="material-icons" style="font-size: 18px;">add</span></button>`;
    }

    if (anime.watched) {
        AnimeCardHtml += `<br><h5>Watched!</h5><br><button class="btn btn-danger" onclick="openRemoveModal('`+ anime.id +`',` + indexCounter + `)"><span class="material-icons" style="font-size: 18px;">delete</span></button>&nbsp;&nbsp;<button class="btn btn-info" onclick="openEditModal('` + anime.id + `')"><span class="material-icons" style="font-size: 18px;">create</span></button></div> </div> </div> </div></div>`;
    }else{
        AnimeCardHtml += `<br><br><a class="btn btn-primary" href='`+ anime.url +`' target='_blank'><span class="material-icons" style="font-size: 18px;">launch</span></a>&nbsp;&nbsp;<button class="btn btn-info" onclick="openEditModal('` + anime.id + `')"><span class="material-icons" style="font-size: 18px;">create</span></button>&nbsp;&nbsp;<button class="btn btn-danger" onclick="openRemoveModal('`+ anime.id +`',` + indexCounter + `)"><span class="material-icons" style="font-size: 18px;">delete</span></button></div> </div> </div> </div></div>`;
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
    ////console.log(JSON.stringify(myAnimes));

    localStorage.setItem('myAnimesJson', JSON.stringify(myAnimes));

    //console.log('Saving your anime data!');
}

//Export list
function exportAnimeFile() {
    try{
        const exportLink = document.createElement("a");
        exportLink.href = URL.createObjectURL(new Blob([JSON.stringify(myAnimes, null, 2)], {type: "application/json"}));
        exportLink.setAttribute("download", "myWatchListData.json");
        document.body.appendChild(exportLink);
        exportLink.click();
        document.body.removeChild(exportLink);

        //console.log('Exporting your anime data!');

        alert(`We exported your last list successfully ;)`);
    }catch(ex){
        alert(`We coulnd't export your list :(\nError: `+ ex);
    }
}

//Import list
function importAnimeFile() {

    try{
        let file = document.getElementById('importJsonFile').files[0];

        if(file){

            let reader = new FileReader();

            reader.onload = function () { 
                try {
                    myAnimes = JSON.parse(reader.result);
                    //console.log('file: ', file ,'\nEspected: ', reader.result, '\n Var: ', myAnimes);
                    
                    savingAnimeFile();
                    showMyAnimes(myAnimes);
                }
                catch (ex) {
                    alert('Exception: ', ex);
                } 
            };

            reader.readAsText(file);
            alert(`Your last list was imported successfully ;)`);
        }else{
            alert(`Please select a file to import!`);
        }

        
    }catch(ex){
        alert(`We coulnd't import your last list :(\nError: `+ ex);
    }



}

//Get archive from Google Drive
function gettingAnimeFile() {
    //console.log('Getting your anime data!');
}

//------------------------------------------- SAVING AND GETTING LIST DATA END --------------------------------------------


// Initializing
init();

