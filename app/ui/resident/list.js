let Store_Resident = require('../../stores/resident')
let Config = require('../../config')
//let normalize = require('electron-shortcut-normalizer')
//let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')

/*var context = new DevExpress.data.ODataContext({
    //url: "http://services.odata.org/V4/Northwind/Northwind.svc",version: 4,
    //url: "http://localhost:8886/NorthwindJpaProducerExample.svc", version :2,
    url : 'http://localhost:9000/3ea8f06baf64/',
    successHandler: function(error) {
        alert(error.message);
    },
    errorHandler: function(error) {
        alert(error.message);
    },
    entities: {
        Categories: { 
            key: "CategoryID", 
            keyType: "Int32" 
        },
        Customers: { 
            name: "Customers",
            key: "CustomerID", 
            keyType: "String" 
        }
    },
    beforeSend: function (sender) {
            sender['params'].user = '6adb637f9cf2';
            sender['params'].password = 'C1myVo6Vd9YJ';
    }
});

var categoriesSource = new DevExpress.data.DataSource(context.Categories);
var customersSource = new DevExpress.data.DataSource(context.Customers);*/

var dataGrid = $("#ui-resident-list-section .gridContainer").dxDataGrid({
    dataSource: Store_Resident,
    masterDetail : {enabled : true},
    rowAlternationEnabled : true,
    showRowLines : true,
    showColumnLines : false,
    selection: {
        mode: "single"
    },
    hoverStateEnabled: true,
    remoteOperations : {
        filtering : false,
        grouping : false,
        paging : false,
        sorting : false,
        summary : false,
    },
    noDataText : '',
    loadPanel : {
        enabled : true,
        height : 90,
        width: 100,
        showPane : true,
        showIndicator : true,
        text : 'Chargement ...'
    },
    editing: {
        allowAdding : false,
        allowDeleting : true,
        allowUpdating : false,
        mode : 'row',
        texts : Config.gridview.editing.texts
    },
    onSelectionChanged: function(data) {
        //deleteButton.option("disabled", !data.selectedRowsData.length)
    }, 
    filterRow: {
        visible: true,
        applyFilter: "auto"
    },
    searchPanel: {
        visible: true,
        width: 240,
        placeholder: "Search..."
    },
    headerFilter: {
        visible: true
    },
    columns: [{
        dataField: "code",
        caption: "Code",
    },{
        dataField: "nom",
        caption: "Nom",
    }, {
        dataField: "prenom",
        caption: "Prenom",
    },
    {
        dataField: "date_naissance",
        alignment: "right",
        dataType: "date",
    },
    {
        dataField: "appartenance_politique",
        alignment: "right",
    }],
    onSelectionChanged: function (selectedItems) {
        var data = selectedItems.selectedRowsData[0];
        if(data) {
            $(".residentInfos").css('display', 'block');
            $(".residentInfos .photo").attr('src', data.photo);
            $(".residentInfos .nom").html(data.prenom + ' '  + data.nom);
            $(".residentInfos .num_cin").html( data.num_cin);
            $(".residentInfos .sexe").html( data.sexe);
            $(".residentInfos .date_naissance").html( data.date_naissance);
            $(".residentInfos .lieu_naissance").html( data.lieu_naissance);
            $(".residentInfos .tel_resident").html( data.tel_resident);
            $(".residentInfos .tel_tuteur").html( data.tel_tuteur);
            $(".residentInfos .nationalite").html( data.nationalite);
            $(".residentInfos .ville").html( data.ville);
            $(".residentInfos .appartenance_politique").html( data.appartenance_politique);
            $(".residentInfos .recommandation").html( data.recommandation);

        }
    }
}).dxDataGrid('instance');

dataGrid.option("masterDetail", {
        enabled: false,
        template: function (container, options) {
            var currentResident =  options.data;
            //$("<div>").text(currentEmployeeData.FirstName + " " + currentEmployeeData.LastName + " Tasks:").appendTo(container);
            //alert(currentResident.photo);
            var img = $('<img>').attr('src', currentResident.photo).attr('height', '180px').attr('width', '160px');
            img.appendTo(container);           
        }
});