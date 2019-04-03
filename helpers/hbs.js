module.exports = {
    dateString: function (date) {
        d = new Date(parseInt(date));
        const newDate = d.toString().replace(/GMT.*/, '');
        // console.log(newDate);
        return newDate;
    },
    getDate: function (date) {
        d = new Date(parseInt(date));
        const newDate = d.toDateString();
        // console.log(newDate);
        return newDate;
    }

}