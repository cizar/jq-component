# jQuery Component

Simple jQuery component builder plugin strongly inspired in ReactJS syntax.

[DEMO](http://cizar.github.io/demos/jq-component-todo.html)

## Usage

Install the plugin

```bash
bower install jq-component
```

Create the component view with Handlebars syntax.

```html
<div id="my-component">
  <script type="text/template">
    <h1>Hello {{name}}!</h1>
    <form on-submit="this.changeName()">
      <input type="text" ref="name">
      <input type="submit" value="Change">
    </form>
  </script>
</div>
```

Include the plugin script and it dependencies.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.3/handlebars.js"></script>
<script src="bower_components/jq-component/src/jquery.component.js"></script>
```

Apply the component plugin to the element.

```html
<script type="text/javascript">
  $(function() {
    $("#my-component").component({
      getInitialState: function() {
        return { name: 'World' };
      },
      changeName: function() {
        this.setState({ name: this.refs.name.value })
      }
    });
  });
</script>
```

Or use the plugin in NodeJS environment

```bash
npm install jquery jq-component
```

Then just require the plugin like any CommonJS module

```javascript
var $ = require('jquery');
require('jq-component');

$('#my-component').component({
  getInitialState: function() {
    return { foo: 'bar' };
  }
});
```
