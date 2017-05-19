Router.configure({
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'nameOfRoute',
  waitOn: function () {
    // we will wait for these subsciptions
    //return [Meteor.subscribe('products'), Meteor.subscribe('images')]
    //return [Meteor.subscribe('products')]
  },
  action: function () {
    // this.ready() is true if all items in the wait list are ready
    Session.set("user", "profile");
    if (this.ready()) this.render('profile');
  }
});

Router.route('/:_id', function () {
  let self = this;
  let id   = self.params._id;
  Meteor.subscribe('users', id, function(){
    Session.set("detailed", "");
    Session.set("user", Users.findOne({_id: id}));
    self.render("dashboard", {
      data: function() {
        return Users.findOne({_id: id});
      }
    });
  });
});
