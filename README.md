# DeePlus
A study in replicating an OTT experience based on the Disney+ browse view.
* [DeePlus](http://www.justinmccraw.com/test/espn/deeplus/) (Password protected)

Best viewed in 720p (1280x720 screen) in Google Chrome.

## Technical Details
Project uses ES5+ features, with TypeScript support and Babel transpiling, along with Sass for CSS and Handlebars for HTML templating.

Folders are broken into `/containers`, `/components`, `/styles`, and `/utilities`. Components contain a TS file, along with an accompanying HBS file. Utilities are helpers that can be used within the application logic, while the helpers folder can be used within Handlebars templates. Styles should be named the same as their respective component, or else broken into further atoms and folders.

## Get started
Install the dependencies …

```bash
$ git clone git@github.com:jmccraw/deeplus.git
$ cd deeplus
$ npm install
```

… then start WebPack:

```bash
$ npm run start
```

This will start a dev server on [http://localhost:8080/](http://localhost:8080/) with hot reloading.

To build the project, run:

```bash
$ npm run build:prod
```