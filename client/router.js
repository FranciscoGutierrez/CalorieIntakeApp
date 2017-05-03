Router.route('/', {
  name: 'nameOfRoute',

  waitOn: function () {
    // we will wait for these subsciptions
    return [Meteor.subscribe('products'), Meteor.subscribe('images')]
  },

  action: function () {
    // this.ready() is true if all items in the wait list are ready
    if (this.ready()) {
      //this.render('yourTemplate');
      $(".loading-screen").fadeOut();
    }
    else {
      // if not ready, you can render another template in the meantime.
      //this.render('Loading');
    }
  }
});
