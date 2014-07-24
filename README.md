# Digit

A Sudoku game based on [Peter Norvig's solver](http://norvig.com/sudoku.html). You can play it [here](http://digit-sudoku.appspot.com/).

![Digit on Google Nexus 7 2, Chrome](/app/img/digit-nexus72.png?raw=true "Digit on Google Nexus 7 2, Chrome")

![Digit on Google Nexus 4, Chrome](/app/img/digit-nexus4.png?raw=true "Digit on Google Nexus 4, Chrome")

## Supported (tested) browsers

- Latest Chrome
- Latest Firefox
- IE 10, 11

Chrome and Firefox are also supported on iOS and Android. The app should work on any browser that supports Flexbox and viewport units.

## Application structure

![Digit architecture](/app/img/digit-arch.png?raw=true "Digit architecture")

    app/
      css/              --> css files
        dist/           --> production css files
        app.css         --> default stylesheet
        elem.css        --> base styles for html elements
      img/              --> image files
      js/               --> javascript files
        dist/           --> production js files
        app.js          --> application controllers, directives, filters and services
        sudoku.js       --> peter norvig's sudoku solver implemented in js
    app.yaml            --> app engine config
    digit.html          --> app layout file (the main html template file of the app)
    digit.jade          --> just like index.html, but loads js files asynchronously
    gulpfile.js         --> build tasks
    package.js          --> node config

## Libraries/Technologies

I'm using Node and Gulp to automate my front-end workflow.

- [Node](http://nodejs.org/api/)
- [Node modules](https://github.com/joyent/node/wiki/modules)
- [Gulp](http://gulpjs.com/)
- [Getting started with Gulp](http://travismaynard.com/writing/getting-started-with-gulp)

I'm using AngularJS for data binding.

- [AngularJS](http://angularjs.org/)
- [AngularJS video tutorials by John Lindquist](http://www.egghead.io/)
- [Angular Seed app project template](https://github.com/angular/angular-seed)

I'm using Jade as a template engine.

- [Jade](https://github.com/visionmedia/jade)

I'm using parts of Dali (elem.css), my own set of basic CSS modules.

- [Dali](https://github.com/melhosseiny/dali)

I'm using Underscore because it is concise/elegant.

- [Underscore](http://underscorejs.org/)
- [Underscore.string](https://github.com/epeli/underscore.string)

I'm hosting the app on Google App Engine.

- [Google App Engine](https://developers.google.com/appengine/)

## Trade-offs/Pending issues

Have a look at the current open issues. Maybe you can help with one of them!

  - More browser support tests
  - Add fallback CSS to the stock Android and iOS browser that don't support Flexbox
  - Add a function to show how the player is doing/diff from solution
  - Add a function to give the player a hint by stepping in the solution
  - Generate puzzles with varying levels of difficulty
  - Light/dark UI theme
  - Add unit tests

## Repository guidelines

- [Commit template](http://programmers.stackexchange.com/questions/42110/can-you-recommend-a-good-commit-message-template-guidelines-to-enforce-in-the)
