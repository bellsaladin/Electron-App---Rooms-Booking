const appRoot = require('app-root-path');
const fs = require('fs')

var config = {};
config.HOST = '';

if(config.HOST == ''){
    try {
        //test to see if settings exist
        var path = appRoot.path;
        path = path.replace(/\\resources\\app.asar/gi, "");
        path += '/settings.json'
        //fs.openSync(path, 'r+'); //throws error if file doesn't exist
        var settingsData=fs.readFileSync(path, "utf8"); //file exists, get the contents
        settingsData = JSON.parse(settingsData);
        config.HOST = settingsData.HOST;
        config.API_REPORTS_URL = 'http://'+config.HOST+'/_RestAPIs/ResidenceUniversitaire/rapports/';
        config.API_BASE_URL = 'http://'+config.HOST+'/_RestAPIs/ResidenceUniversitaire/api.php/';

    } catch (err) {
        //if error, then there was no settings file (first run).
        alert('Erreur lors du chargement du fichier settings.json')
        //app.quit()
    }
}

config.gridview = {
    editing : {
        texts : {
            editRow : 'Modifier',
            deleteRow : 'Supprimer',
            addRow : 'Ajouter',
            saveRowChanges : 'Enregistrer',
            cancelRowChanges : 'Annuler',
            confirmEditMessage : 'Etes-vous sûr de vouloir supprimer cet enregistrement',
            confirmDeleteMessage : 'Etes-vous sûr de vouloir modifier cet enregistrement',
            confirmDeleteTitle : 'Confirmation',
        }
    }
}
module.exports = config;