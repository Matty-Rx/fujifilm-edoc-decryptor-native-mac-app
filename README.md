# FujiFilm EDOC Decryptor Native Mac App

Native macOS Swift app for decrypting FujiFilm EDOC manuals and converting them into locally browsable HTML.

## What It Does

- Select a FujiFilm `manual/` folder
- Decrypt encrypted EDOC pages
- Rewrite the manual so it works locally on macOS
- Bundle or copy the required `common_e2` assets
- Output a browsable decrypted manual

## Project Status

This project is a native Swift macOS app, not a wrapped Python GUI.

Main implementation lives in:

- `FujiFilm eDoc Decrypion Tool/ContentView.swift`

Bundled support assets live in:

- `FujiFilm eDoc Decrypion Tool/common_e2/`

## Building

1. Open the Xcode project.
2. Build and run the app.
3. Choose the source `manual/` folder.
4. Choose an output folder unless you are using in-place mode.

## Sandbox Notes

Because this is a sandboxed macOS app, file access matters.

- `User Selected File` should be `Read/Write`
- If you are writing into `Downloads`, `Downloads Folder` access should be `Read/Write`
- If you change sandbox entitlements, rebuild the app before testing again

## Output Behavior

- In normal mode, the selected output folder is used as the destination root
- In in-place mode, the source folder is modified directly
- `common_e2` is copied into the output so the manual renders correctly

## Repository

Working branch created for this native app work:

- `native-macos-app`
