# CoreUI Modal

**[DEMO](https://shabuninil.github.io/coreui-modal)**


### Install with NPM

`npm install coreui-modal`

### Example usage

```js

CoreUI.modal.show("Title modal", "Body content", {
    footer: "Footer content",
    onShow: function (event) {
        console.log('Show');
    },
    onShown: function (event) {
        console.log('Shown');
    },
    onHide: function (event) {
        console.log('Hide');
    },
    onHidden: function (event) {
        console.log('Hidden');
    },
    onHidePrevented: function (event) {
        console.log('Hide prevented');
    }
})

```

![Panel](https://raw.githubusercontent.com/shabuninil/coreui-modal/main/preview.png) 
