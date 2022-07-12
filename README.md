# Web Gallery for the Fotos
This repo contains the code for a web gallery application that uses a Box as the storage. Users can view the photos that they have uploaded to their Box using the Fotos app.

The latest stable version of this repo is published at [gallery.fx.land](gallery.fx.land). You can connect the app to your Box and the wallet that you used for backing up your photos in the Fotos app.

The web gallery uses Fula Protocol Suite to retreive files and their metadata from a Box instance. It uses DID keys generated from a connected wallet to decrypt the data and show them.

## Development
If you want to play with the code or develop a new feature, you can do it like you do with any other `create-react-app` application.

First you need to install the dependencies:
```bash
yarn
```

Then start the development server
```bash
yarn start
```

You can make a production build using
```bash
yarn run build
```