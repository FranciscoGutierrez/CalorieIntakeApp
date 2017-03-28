import { Meteor } from 'meteor/meteor';

Products = new Meteor.Collection('products');

Meteor.startup(() => {
  // Insert sample data if the Products collection is empty
  if (Products.find().count() === 0) {
    JSON.parse(Assets.getText("products.json")).forEach(function (item) {
      Products.insert(item);
    });
  }
});

SearchSource.defineSource('products', function(searchText, options) {
  return Products.find({}, {sort: {name: -1}, limit: 20}).fetch();
});

function buildRegExp(searchText) {
  // this is a dumb implementation lol!!!!
  let parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
