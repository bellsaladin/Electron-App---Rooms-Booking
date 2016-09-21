
var config = { {
    modules : { 
        {moduleName : 'resident', moduleType : 'CRUD' }, 
        {moduleName : 'resident', moduleType : 'EntityDetails', rootEntity : 'resident' } 
    },
    params : { apiBaseURL : 'http://.../'}
}}; 

module.exports = config;