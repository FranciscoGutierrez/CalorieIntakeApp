import { Meteor } from 'meteor/meteor';

Products = new Meteor.Collection('products');
Images   = new Meteor.Collection('images');
Similar  = new Meteor.Collection('similar');
Users    = new Meteor.Collection('users');

Meteor.startup(() => {
  // Insert sample data if the Products collection is empty
  /*
  if (Products.find().count() === 0) {
    JSON.parse(Assets.getText("products.json")).forEach(function (item) {
      Products.insert(item);
    });
  }
  */
});

SearchSource.defineSource('products', function(searchText, options) {
  options  = {sort: {product_name: -1}, limit: 6};
  if(searchText) {
    let regExp = buildRegExp(searchText);
    let selector = {$or: [{product_name: regExp}]};
    return Products.find(selector, options).fetch();
  } else {
    return Products.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation -> lol!!!!
  let parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

Meteor.publish('images', function(image) {
  return Images.find({id:image});
});

Meteor.publish('products', function(productid) {
  return Products.find({_id: productid});
});

Meteor.publish('similar', function (productid) {
  return Similar.find({_id: productid});
});
