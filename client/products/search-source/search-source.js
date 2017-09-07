let fields = ['name'];
let options = {keepHistory: 1000 * 60 * 5, localSearch: true};
ProductSearch = new SearchSource('products', fields, options);

Template.products.helpers({
  // getProducts: function() {
  //   return ProductSearch.getData({
  //     transform: function(matchText, regExp) {
  //       //return matchText.replace(regExp, "<b>$&</b>")
  //       return matchText
  //     },sort: {name: -1}
  //   });
  // },
  isLoading: function() {
    //console.log(ProductSearch.getStatus());
    return ProductSearch.getStatus().loading;
  },
  getProducts: function(){
    let navbar = Session.get("navbar");
    let fruits_tags   = ["en:fruits-in-syrup", "en:canned-fruits", "en:fruits-based-foods","en:fruit-preserves", "en:fruit-based-beverages", "en:fruit-juices", "en:fruit-juices-and-nectars"];
    let veggies_tags  = ["en:plant-based-foods", "en:dehydrated-vegetable-soups", "en:vegetable-soups", "nl:vegetarian-meatballs",  "en:prepared-vegetables", "fr:ratatouilles"];
    let drinks_tags   = ["en:beverages","en:carbonated-drinks","en:sodas","en:sugared-beverages", "en:hot-beverages",  "en:non-sugared-beverages"];
    let proteins_tags = ["en:meats","en:seafood", "fr:salade-de-poulet-curry", "en:soupe","en:seafood","en:fishes"];
    let snacks_tags   = ["en:desserts","en:salty-snacks", "en:waffles", "en:sugary-snacks", "en:chocolates", "en:ketchup", "en:jams"];
    let grains_tags   = ["en:sandwiches", "en:cereal-bars",  "en:cereals-and-potatoes", "en:cereals-and-their-products", "en:breakfast-cereals", "en:cereals-and-potatoes", "en:breads", "en:baguettes"];
    let dairy_tags    = ["fr:fromages-blancs", "en:dairies", "en:cheeses", "en:cow-cheeses", "en:uncooked-pressed-cheeses", "fr:fromage-a-pate-dure", "en:yogurts", "en:fruit-yogurts", "fr:yaourts-sur-lit-de-fruits"];
    let results = [];
    let nav = Session.get("nav");
    let lim = 15;
    if (navbar == "vegetables") {
      Meteor.subscribe("tags",veggies_tags);
      results = Products.find({"categories_tags": { $in:  veggies_tags}}, {limit: lim, skip: lim*nav});
    }
    if (navbar == "fruits") {
      Meteor.subscribe("tags",fruits_tags);
      results = Products.find({"categories_tags": { $in:  fruits_tags}}, {limit: lim, skip: lim*nav});
    }
    if (navbar == "proteins"){
      Meteor.subscribe("tags",proteins_tags);
      results = Products.find({"categories_tags": { $in:  proteins_tags}}, {limit: lim, skip: lim*nav});
    }
    if (navbar == "grains") {
      Meteor.subscribe("tags",grains_tags);
      results = Products.find({"categories_tags": { $in:  grains_tags}}, {limit: lim, skip: lim*nav});
    }
    if (navbar == "drinks") {
      Meteor.subscribe("tags",drinks_tags);
      results = Products.find({"categories_tags": { $in:  drinks_tags}}, {limit: lim, skip: lim*nav});
    }
    if (navbar == "dairy") {
      Meteor.subscribe("tags",dairy_tags);
      results = Products.find({"categories_tags": { $in:  dairy_tags}}, {limit: lim, skip: lim*nav});
    }
    if (navbar == "snacks") {
      Meteor.subscribe("tags",snacks_tags);
      results = Products.find({"categories_tags": { $in:  snacks_tags}}, {limit: lim, skip: lim*nav});
    }
    return results;
  }
});

Template.products.events({
  "keyup .searchProduct": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    ProductSearch.search(text);
  }, 200)
});
