// qgr-cntrl-select

define(function (require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Handlebars = require('handlebars');
  var select_tmpl = require('text!tmpl/select.html');


  var SelectChoice = Backbone.Model.extend({
    // Has attrs:
    //  - choices (array of choices)
    //  - choice_val (selected choice)

    get_subtree: function() {
      if (this.get('choice_val')) {
        return {
          eq: [
            this.get('col'),
            this.get('choice_val')
          ]
        };
      }
    }

  });

  var SelectChoiceView = Backbone.View.extend({
    // Represent an individual checkbox with a view.

    tmpl: Handlebars.compile(select_tmpl),

    events: {
      'change select': 'set_choice',
    },

    initialize: function(options) {
      // Initialize with a choice model in the options hash.
      _.bindAll(this, 'render', 'set_choice')
      this.choice_model = this.options.choice_model;
      this.label = this.options.label;
    },

    render: function() {
      var t = this;

      var choices = _.map(this.choice_model.get('choices'), function(choice) {
        // Handle null specially for IE8.
        var choice_val = choice ? choice.val : '';

        // Flag the selected choice.
        if (choice_val === t.choice_model.get('choice_val')) {
          return _.extend({}, choice, {selected: true});
        }
        return _.extend({}, choice, {selected: false});
      });

      var render_content = this.tmpl({
        label: this.label,
        id: this.el.id + 'select',
        choices: choices
      })
      this.$el.html(render_content);
      return this
    },

    set_choice: function(e) {
      this.choice_model.set('choice_val', e.currentTarget.value);
      this.render();
    },

  });


  // Return exports.
  return {
    SelectChoice: SelectChoice,
    SelectChoiceView: SelectChoiceView,
  };

});

