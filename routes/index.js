module.exports = (app)=>{
    require('./personRoute')(app);
    require('./familyRoute')(app);
    require('./universeRoute')(app);
}