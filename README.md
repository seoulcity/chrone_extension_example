# Tailwind Chrome Extension

A simple Chrome extension using only Tailwind CSS for styling.

## Features

- Displays a popup with Tailwind CSS styling (400x300px, 4:3 ratio)
- Toggles dark mode on the current webpage when the button is clicked
- Responsive design using Tailwind CSS utility classes
- No traditional CSS files - uses only Tailwind utility classes

## Technologies Used

- Chrome Extension API
- Tailwind CSS (integrated via CDN)
- JavaScript

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked" and select the directory containing this extension
4. The extension should now appear in your toolbar

## Usage

1. Click on the extension icon in the toolbar to open the popup
2. Click the "Click Me!" button to toggle dark mode on the current webpage

## About Tailwind CSS Integration

This extension uses Tailwind CSS for styling via a local copy of the Tailwind CDN script. This approach:

- Avoids any build steps or complex configuration
- Allows using all Tailwind CSS features directly in HTML
- Works perfectly within the Chrome Extension environment
- Includes custom theme colors defined in the popup.html
- Eliminates the need for traditional CSS files 