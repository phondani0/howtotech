module.exports = {
    parseDate: function (date) {
        d = new Date(parseInt(date));
        const newDate = d.toString().replace(/[(].*/, '');
        // console.log(newDate);
        return newDate;
    }
}