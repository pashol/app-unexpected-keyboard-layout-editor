# [Unexpected Keyboard Layout Editor](https://uk-layout-editor.vercel.app/)

A tool for creating and editing layouts for the Unexpected Keyboard for Android devices.

https://uk-layout-editor.vercel.app/

## Changes in This Fork

This is a fork of [lixquid/app-unexpected-keyboard-layout-editor](https://github.com/lixquid/app-unexpected-keyboard-layout-editor), updated to target [pashol/Unexpected-Keyboard](https://github.com/pashol/Unexpected-Keyboard).

Improvements over the original:

- Fixed `bottom_row` XML parsing bug (`z.coerce.boolean()` misread `"false"` as `true`)
- Improved duplicate key warnings on import
- Completed KeyLegend icons and labels to mirror the Android keyboard
- Completed KeyInput autocomplete list to match upstream `KeyValue.java`
- Added layout validation matching upstream `check_layout.py` rules

## How to Use

1. To get started, either:
    1. Select a layout under the *Start from a template* dropdown, or
    2. Import a layout from its XML by putting it in the *Import from XML* box and clicking *Import*.
2. Add rows by clicking the *Add Row* button, or edit / remove existing rows by clicking on the cog button on the right side of the row.
3. Add keys to rows by clicking the Plus button on the right side of the row, or edit / remove existing keys by clicking on the key itself.
4. Once you're done, click *Export to XML* to get the XML for your layout.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Start the development server: `yarn start`
4. Open http://localhost:8080 in your browser

Changes to the source files will be automatically reloaded in the browser.

### Building for Production

1. Remove the `dist` folder: `rm -rf dist`
2. Build the project: `yarn build`
3. The production files will be in the `dist` folder
