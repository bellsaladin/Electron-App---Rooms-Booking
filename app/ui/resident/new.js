let Store_Resident = require('../../stores/resident')
let Store_Countries = require('../../stores/countries')
let Utils = require('../../utils')

var photoResident = null;

var sectionId = 'ui-resident-new-section';
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')
var formData = {
    //id: "1",
    etranger : false,
    code : '',
    num_cin : '',
    nom: "",
    prenom: "",
    date_naissance: "1990-01-01",
    lieu_naissance : '',
    tel_resident : '',
    tel_tuteur : '',
    sexe : 'M',
    nationalite : 'Maroc',
    ville : '',
    appartenance_politique : 'Non',
    recommandation : 'Non',
    photo : null,
}

var form = $("#" + sectionId + " .form").dxForm({
    formData: formData,
    enctype : 'multipart/form-data',
    items: [//{dataField: 'id'},
            {dataField: 'code', editorOptions : { disabled : true} },
            {},
            {itemType: "group",
             caption: "Informations personnelles",
             items: 
                [
                {
                    editorType: 'dxSelectBox',
                    dataField: 'sexe',
                    editorOptions : {
                        dataSource : [{val : 'M', txt : 'Masculin'}, {val : 'F', txt : 'Feminin'}],
                        valueExpr: 'val',
                        displayExpr: 'txt',
                        onValueChanged: function (e) {
                            //alert('Pavillon selectionné : ' + e.value);
                            setCodeResident(e.value);
                            return;
                        } 
                    }
                },
                {dataField: 'etranger', editorType : 'dxCheckBox',
                    editorOptions : {
                        onValueChanged: function (e) {
                            if(e.value == true){
                                form.itemOption('Informations personnelles.num_cin', {label : {text  :  'Num Passeport'}});
                            }else{
                                form.itemOption('Informations personnelles.num_cin', {label : {text  :  'Num CIN'}});
                            }
                        } 
                    }
                },
                {dataField: 'num_cin', label : {text : 'Num CIN'} },
                {dataField: 'nom'},
                {dataField: 'prenom'},
                {
                    editorType: 'dxDateBox',
                    dataField: 'date_naissance',
                    label: {
                        showColon: true,
                        text: 'Date de naissance'
                    }
                },
                //{dataField: 'nationalite'},
                {
                    editorType: 'dxSelectBox',
                    dataField: 'nationalite',
                    label : {text : 'Pays'},
                    editorOptions : {
                        dataSource : Store_Countries,
                        valueExpr: 'name',
                        displayExpr: 'name',
                        searchEnabled : true,
                        searchMode : 'contains',
                        activeStateEnabled : false,
                        deferRendering : false
                    }
                },
                {dataField: 'ville'},
                {dataField: 'lieu_naissance'}]
            },
            {itemType: "group",
             caption: "Photo",
             items: 
                [{
                    editorType: 'string', 
                    dataField: 'photo',
                    label : {visible : false}
                }]
            },
            {itemType: "group",
             caption: "Contact",
             items: [{dataField: 'tel_resident'},
                     {dataField: 'tel_tuteur'},]
            },
            {itemType: "group",
             caption: "Autres",
             items: [
                     {dataField: 'appartenance_politique'},
                     {dataField: 'recommandation'},]
            },
            //{editorType : 'dxTextArea', dataField: 'adresse'},
            ],
            customizeItem: function (item) {
                    if (item.dataField !== 'photo')
                        return;
                        //alert('customizeItem');
                    item.template = function (data, itemElement) {
                        var value = data.editorOptions.value;
                        if(value == null){
                            value = 'assets/img/resident-homme-placeholder.png';
                        }
                        //$('<input>').attr('type', 'hidden').prop('value', value).appendTo(itemElement);
                        photoResident = $('<img>').attr('src', value).attr('height', '180px').attr('width', '160px');
                        photoResident.appendTo(itemElement);
                        //$('<div>').html(value).appendTo(itemElement);
                        var fileUploaderContainer = $('<div>');
                        var photoUploader = fileUploaderContainer.dxFileUploader({selectButtonText: "Parcourir",
                                            labelText: 'Ou glissez la par ici',
                                            multiple: false,
                                            accept: 'image/*',
                                            //accept: "image/*",
                                            uploadMode: "useForm",
                                            name: 'photo',
                                            uploadUrl: '/upload.php',
                                            onValueChanged: function (e) {
                                                //alert('File upload changed, new value : ' + e.value);
                                                console.log('File upload changed, new value : ');
                                                console.log(e);
                                                if (e.value != null) {
                                                    if (e.value.size > 150000) {
                                                        alert('file too big') ;
                                                        //e.element.find(".dx-fileuploader-file-container").eq(0).find(".dx-fileuploader-cancel-button").trigger("dxclick");
                                                    }
                                                }
                                                //data.editorOptions.value = e.value; // convert to base64
                                                
                                                var blobFile = e.value[0];
                                                //var blobFile = e.value;
                                                fileReader.readAsDataURL( blobFile );  
                                            } 
                        }).dxFileUploader('instance');
                        fileUploaderContainer.appendTo(itemElement);
                        $('<div>').dxButton({
                            text: 'Camera',
                            onClick: function() {

                                popupCamera.show();
                            }
                        }).appendTo(itemElement);
                    }
                },
    colCount: 2
}).dxForm('instance');

$("#" + sectionId + " .button-save").dxButton({
    text: 'Enregistrer',
    onClick: function() {
        var formData = form.option('formData');

        formData.etranger = (formData.etranger== true)?1:0; // important conversion

        Store_Resident.insert(formData);
        Utils.showToastMsg('success', 'Resident enregistré');
        setCodeResident(formData.sexe); // generate new code
        // temporary
        $("#ui-resident-list-section .gridContainer").dxDataGrid('instance').refresh();
    }
});

setCodeResident('M');

function setCodeResident(sexe){
    Store_Resident.load()
    .done(function(result) {
        var lastCode = 0;
        for (var i = 0; i < result.length; i++) {
            var resident = result[i];
            if(resident.code == null || resident.code.length == 0) continue;
            if(sexe == resident.sexe){
                var residentCodeConvertedToInt = parseInt(resident.code.substring (1,4));
                if( residentCodeConvertedToInt > lastCode)
                    lastCode = residentCodeConvertedToInt;
            }
        }
        formData.sexe = sexe;
        var newNum = Utils.pad(lastCode + 1, 3);
        var newCode = (sexe == 'M')?'G'+newNum: 'F'+newNum;
        formData.code = newCode;
        form.updateData(formData);
        return;
    })
    .fail(function(error) {
        // handle error
    });
}

// file reader which does convert from blob to base64
var fileReader = new FileReader();
fileReader.onload = function(e) {
    photoResident.attr('src', e.target.result);
    //data.editorOptions.value = e.target.result;
    formData.photo = e.target.result;
    //alert(formData.photo);
    form.updateData('photo', e.target.result);
    //EL("photoResident").src       = e.target.result;
    //EL("b64").innerHTML = e.target.result;
    //alert('data.editorOptions.value : ' + data.editorOptions.value);
}; 

// WebCamera related code

var popupCamera = null,
    popupCamera_options = {
        width: 'auto',
        height: 'auto',
        onShown : function(e){
            initWebCam();
        },
        showTitle: true,
        title: "Prise de photo",
        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: true
};

//popupCamera && $(".popup-camera").remove();
$popupContainer = $("#" + sectionId + " .popup-camera");
popupCamera = $popupContainer.dxPopup(popupCamera_options).dxPopup("instance");



var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video = null;
var canvas = null;
var button_capture = null;

function initWebCam() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    button_capture = document.getElementById('button_capture');

    navigator.getMedia = ( navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);

    navigator.getMedia(
        {
        video: true,
        audio: false
        },
        function(stream) {
        if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
        } else {
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
        },
        function(err) {
        console.log("An error occured! " + err);
        }
    );

    video.addEventListener('canplay', function(ev){
        if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
        
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
        
        if (isNaN(height)) {
            height = width / (4/3);
        }
        
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
        }
    }, false);

    button_capture.addEventListener('click', function(ev){
        takePicture();
        popupCamera.hide();
        ev.preventDefault();
    }, false);

    clearphoto();
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    
    photoResident.attr('src', data);
    formData.photo = data;
    form.updateData('photo', data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takePicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photoResident.attr('src', data);
        formData.photo = data;
        form.updateData('photo', data);

    } else {
        clearphoto();
    }
}