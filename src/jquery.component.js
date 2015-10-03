;(function($, undefined) {

  'use strict';

  var pluginName = 'component';

  var Plugin = function(element, args) {
    this.bootstrapping = true;
    this.element = element;
    this.state = {};
    if ($.isPlainObject(args) || $.isArray(args)) {
      this.state = args;
    } else {
      if ('string' === typeof args) {
        args = $[args];
      }
      if ($.isFunction(args)) {
        args.call(this, element);
      }
    }
    this.views = $('script[type^=text]', element).map(function() {
      var source = $(this).html();
      var $view = $('<div class="component-view">');
      $view.data('template', Handlebars.compile(source));
      $(this).replaceWith($view);
      return $view;
    });
    this.on(element, 'click [on-click]', this.onClick);
    this.on(element, 'submit [on-submit]', this.onSubmit);
    this.on(element, 'change [on-change]', this.onChange);
    this.render();
    this.bootstrapping = false;
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

  Plugin.prototype.setState = function(newState) {
    if ($.isArray(newState)) {
      this.state = newState;
    } else {
      this.state = $.extend(this.state, newState);
    }
    if (!this.bootstrapping) this.render();
  };

  Plugin.prototype.render = function() {
    var context = this.state;
    this.views.each(function() {
      var template = $(this).data('template');
      var html = template(context)
      $(this).html(html);
    });
    this.refs = $('[ref]').toArray().reduce(function(p, c) {
      p[c.attributes.ref.value] = c;
      return p;
    }, {});
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      new Plugin(this, options);
    });
  };

  $(function() {
    $('[data-' + pluginName + ']').each(function() {
      $(this)[pluginName]($(this).data(pluginName));
    });
  });

}(jQuery));
