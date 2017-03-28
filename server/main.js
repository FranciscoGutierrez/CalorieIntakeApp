import { Meteor } from 'meteor/meteor';

Products = new Meteor.Collection('products');

Meteor.startup(() => {
  // Insert sample data if the student collection is empty
  if (Products.find().count() === 0) {
    JSON.parse(Assets.getText("products.json")).forEach(function (item) {
      Products.insert(item);
    });
  }
});

SearchSource.defineSource('packages', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {packageName: regExp},
      {description: regExp}
    ]};
    return Packages.find(selector, options).fetch();
  } else {
    return Packages.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
