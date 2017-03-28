let fields = ['name'];
let options = {keepHistory: 1000 * 60 * 5, localSearch: true};
ProductSearch = new SearchSource('products', fields, options);

Template.products.helpers({
  getProducts: function() {
    return ProductSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },sort: {name: -1}
    });
  },
  isLoading: function() {
    console.log(ProductSearch.getStatus());
    return ProductSearch.getStatus().loading;
  }
});

Template.products.events({
  "keyup .searchProduct": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    ProductSearch.search(text);
  }, 200)
});
