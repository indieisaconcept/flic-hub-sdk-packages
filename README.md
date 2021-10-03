# Flick Hub SDK Scripts

Collection of [Flic Hub SDK](https://hubsdk.flic.io/static/tutorial/) scripts.

## Packages

- **helpers** provides a collection of helpers for building packages
- **sonos** provides extended home theatre control

## Usage

All packages are located in the `./dist` directory. Copy the file contents &
create a corresponding package on your hub.

### Configuration

Each package supports basic configuration by supplying query string parameters.

```
sdk://<package-name>?configValue=1&configValue=2
```
