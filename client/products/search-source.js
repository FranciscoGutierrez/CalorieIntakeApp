let fields = ['packageName', 'description'];
let options = {keepHistory: 1000 * 60 * 5, localSearch: true};

PackageSearch = new SearchSource('packages', fields, options);

Template.products.helpers({
  getPackages: function() {
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  },

  isLoading: function() {
    return PackageSearch.getStatus().loading;
  }
});

Template.products.events({
  "keyup .searchProduct": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);
  }, 200)
});
