;(function(root, undefined) {

  'use strict';

  var pluginName = 'component';

  var $ = root.jQuery;

  if ('undefined' === typeof $) {
    if ('undefined' === typeof require) {
      $.error('The plugin "' + pluginName + '" requires jQuery');
    }
    $ = require('jquery');
  }

  require('jq-render');

  var Plugin = function(element, specification) {
    if (!$.isPlainObject(specification)) {
      $.error('Component specification should be an object');
    }
    this.element = element;
    this.$views = $('script[type^=text]', element).map(function() {
      var template = $(this).html();
      var $view = $('<div>').render(template);
      $(this).replaceWith($view);
      return $view;
    });
    $.extend(this, specification);
    this.state = {};
    this.props = $(element).data();
    this.on(element, 'click [on-click]', this.onClick);
    this.on(element, 'submit [on-submit]', this.onSubmit);
    this.on(element, 'change [on-change]', this.onChange);
    this.setState(this.getInitialState());
  };

  Plugin.prototype.on = function(elements, eventType, eventHandler) {
    var matches = eventType.match(/^(\S+)(\s+(.+))?$/);
    $(elements).on(matches[1], matches[3], $.proxy(eventHandler, this));
  };

  Plugin.prototype.onClick = function(event) {
    event.preventDefault();
    eval(event.currentTarget.attributes['on-click'].value);
  };

  Plugin.prototype.onSubmit = function(event) {
    event.preventDefault();
    eval(event.currentTarget.attributes['on-submit'].value);
  };

  Plugin.prototype.onChange = function(event) {
    event.preventDefault();
    eval(event.currentTarget.attributes['on-change'].value);
  };

  Plugin.prototype.getInitialState = function() {
    return {};
  };

  Plugin.prototype.setState = function(newState) {
    if (!$.isPlainObject(newState)) {
      $.error('New state should be an object');
    }
    $.extend(this.state, newState);
    this.render();
  };

  Plugin.prototype.render = function() {
    this.$views.render(this.state);
    this.refs = $('[ref]', this.element).toArray().reduce(function(p, c) {
      p[c.attributes.ref.value] = c;
      return p;
    }, {});
  };

  $.fn[pluginName] = function(specification) {
    return this.each(function() {
      if (!$(this).data('plugin_' + pluginName)) {
        $(this).data('plugin_' + pluginName, new Plugin(this, specification || {}));
      } else {
        $.error('Sorry, ' + pluginName + ' can not be initialized again');
      }
    });
  };

  $(function() {
    $('[data-' + pluginName + ']').each(function() {
      var initialState = $(this).data(pluginName);
      $(this)[pluginName]({
        getInitialState: function() {
          return initialState;
        }
      });
    });
  });

}(this));
