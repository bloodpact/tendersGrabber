//for query to zakupki.gov
const moment = require('moment')
module.exports ={
    formateDate: function (date) {
       return moment(date).format("DD.MM.YYYY")
    }
};
