if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURL:'mongodb://88elikort:Qwertyuiop1!@ds361085.mlab.com:61085/gz_parser'
    }
} else{
    module.exports = {
        mongoURL:'mongodb://localhost/parser-back-dev'
    }
}