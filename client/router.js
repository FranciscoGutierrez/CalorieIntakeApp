Router.configure({
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'nameOfRoute',
  waitOn: function () {
    // we will wait for these subsciptions
    return [Meteor.subscribe('products'), Meteor.subscribe('images')]
  },
  action: function () {
    // this.ready() is true if all items in the wait list are ready
    if (this.ready()) this.render('profile');
  }
});
