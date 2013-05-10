//= require "_libs/jquery-ajax-css-deprecated-dimensions-effects-event-alias-offset-sizzle-wrap"
//= require "handlebars"
//= require "ember"

var App = Ember.Application.create({

});

App.Category = Ember.Object.extend({
  tags: function() {
    var tags = Ember.A([]);

    this.get('data').forEach(function(cat) {
      tags.pushObjects(cat.get('tags'));
    });

    return tags.uniq();
  }.property('data.@each.tags'),

  itemsByTag: function(tagName) {
    tagName = tagName.toLowerCase();
    if (tagName === 'all') { return this.get('data'); }

    return this.get('data').filter(function(item) {
      return item.get('tags').filterProperty('name', tagName.capitalize()).length;
    });
  }
});

App.DirectoryItem = Ember.Object.extend({
  tagsWithoutOfficial: function() {
    return this.get('tags').rejectProperty('name', 'Official');
  }.property('tags.@each'),

  isOfficial: function() {
    return this.get('tags').filterProperty('name', 'Official').length;
  }.property('tags.@each')
});

App.Tag = Ember.Object.extend({});
App.Tag.allTags = Ember.Map.create({});
App.Tag.tagForName = function(tagName) {
  if (!App.Tag.allTags.has(tagName)) {
    App.Tag.allTags.set(tagName, App.Tag.create({ name: tagName.capitalize() }));
  }
  return App.Tag.allTags.get(tagName);
};

var ObjectifiedCategories = CATEGORIES.map(function(cat) {
  cat.data = cat.data.map(function(item) {
    item.tags = item.tags.map(function(tag) {
      return App.Tag.tagForName(tag);
    });
    return App.DirectoryItem.create(item);
  });
  return App.Category.create(cat);
});

App.Router.map(function() {
  this.resource("category", { path: "/:category_name" }, function() {
    this.route("tag", { path: "/:tag_name" });
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('category', ObjectifiedCategories.findProperty('name', 'Extensions'));
  }
});

App.CategoryIndexRoute = Ember.Route.extend({
  needs: ['category'],
  redirect: function() {
    this.transitionTo('category.tag', this.controllerFor('category').get('content'), App.Tag.tagForName('all'));
  }
});

App.CategoryRoute = Ember.Route.extend({
  model: function(params) {
    return ObjectifiedCategories.find(function(cat) {
      return cat.get('name').toLowerCase() === params.category_name;
    });
  },

  serialize: function(params) {
    return { category_name: params.name.toLowerCase() };
  }
});

App.CategoryTagRoute = Ember.Route.extend({
  model: function(params) {
    return App.Tag.tagForName(params.tag_name);
  },

  serialize: function(params) {
    return { tag_name: params.get('name').toLowerCase() };
  }
});

App.ApplicationController = Ember.Controller.extend({
  categories: ObjectifiedCategories,
  filterText: null,

  filter: function(filterText) {
    this.set('filterText', filterText);
  }
});

App.CategoryController = Ember.ObjectController.extend({
  sortedTags: function() {
    var sortedTags = Ember.copy(this.get('tags'));

    sortedTags.sort(function(item1, item2) {
      if (item1.get('name') === 'Official') { return -1; }
      if (item2.get('name') === 'Official') { return 1; }
      return item1.get('name').localeCompare(item2.get('name'));
    });

    sortedTags.unshiftObject(App.Tag.tagForName('all'));

    return sortedTags;
  }.property('tags.@each')
});

App.CategoryTagController = Ember.ObjectController.extend({
  needs: ['application', 'category'],

  items: function() {
    var categoryController = this.get('controllers.category');
    var allItems = categoryController.get('content').itemsByTag(this.get('name'));

    var filterText = (this.get('controllers.application.filterText') || '').toLowerCase();
    if (!Ember.isEmpty(filterText)) {
      allItems = allItems.filter(function(item) {
        return (
          (item.get('name').toLowerCase().indexOf(filterText) > -1) ||
          (item.get('description').toLowerCase().indexOf(filterText) > -1)
        );
      });
    }

    return allItems;
  }.property('controllers.category.name', 'name', 'data.@each', 'controllers.application.filterText'),

  sortedItems: function() {
    var items = Ember.copy(this.get('items'));
    items.sort(function(item1, item2) {
      if (item1.get('isOfficial')) { return -1; }
      if (item2.get('isOfficial')) { return 1; }

      return item1.get('name').localeCompare(item2.get('name'));
    });
    return items;
  }.property('name', 'items.@each.isOfficial', 'items.@each.name')
});

App.FilterView = Ember.View.extend({
  classNames: ['input-append'],
  template: Ember.Handlebars.compile('{{view Ember.TextField valueBinding="view.value" class="listjs-search" placeholder="Search to filter extensions..."}}<button {{action clickedButton target="view"}} id="listjs-search-remove" class="btn btn-middleman listjs-search-icon"><i {{bindAttr class=view.buttonClassNames}}></i></button>'),

  buttonClassNames: function() {
    var classes = Ember.A(['icon-white']);
    classes.pushObject(Ember.isEmpty(this.get('value')) ? 'icon-search' : 'icon-remove');
    return classes.join(" ");
  }.property('value'),

  clickedButton: function() {
    if (!Ember.isEmpty(this.get('value'))) {
      this.set('value', '');
    }
  }
});