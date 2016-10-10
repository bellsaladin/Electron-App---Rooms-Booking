var config = {};
config.API_REPORTS_URL = 'http://localhost/_RestAPIs/ResidenceUniversitaire/rapports/';
config.API_BASE_URL = 'http://localhost/_RestAPIs/ResidenceUniversitaire/api.php/';

config.gridview = {
    editing : {
        texts : {
            editRow : 'Modifier',
            deleteRow : 'Supprimer',
            addRow : 'Ajouter',
            saveRowChanges : 'Enregistrer',
            CancelRowChanges : 'Annuler',
            confirmEditMessage : 'Etes-vous sûr de vouloir supprimer cet enregistrement',
            confirmDeleteMessage : 'Etes-vous sûr de vouloir modifier cet enregistrement',
            confirmDeleteTitle : 'Confirmation',
        }
    }
}
module.exports = config;