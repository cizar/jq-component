# jQuery Component

Simple jQuery component plugin

```html
<div id="my-component">
  <script type="text/template">
    <h1>Hello {{foo}}!</h1>
    <form on-submit="this.changeName()">
      <input type="text" ref="name">
      <input type="button" value="Change">
    </form>
  </script>
</div>
```

```javascript
$("#my-component").component(function() {
  this.setState({ foo: 'World' });
  this.changeName = function() {
    this.setState({ foo: this.refs.name.value });
  };
});
````
