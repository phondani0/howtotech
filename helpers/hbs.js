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
  },
  select: function (selected, options) {
    return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  toBase64: function (data) {
    if (data) {
      return data.toString('base64');
    } else {
      return "";
    }
  }
}