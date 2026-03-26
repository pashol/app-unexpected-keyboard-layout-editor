# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based editor for creating and editing keyboard layouts for the [Unexpected Keyboard](https://github.com/Julow/Unexpected-Keyboard) Android app. It imports/exports the XML format used by that app.

## Commands

```bash
yarn install        # Install dependencies
yarn start          # Dev server at http://localhost:8080
yarn build          # Production build
yarn lint           # TypeScript type-check + Prettier format check
```

There is no test framework configured.

## Tech Stack

- **Preact** (not React) — use `h`, `Fragment`, `useState`, etc. from `preact` or `preact/hooks`
- **TypeScript** (strict mode) — no implicit any, no implicit returns, no fallthrough
- **Vite** — bundler
- **Bootstrap 5** + **Bootstrap Icons** — UI styling
- **Zod** — XML schema validation on import
- **xml2js** — XML parsing and serialization
- **Prettier** — 80-char line width, 4-space tabs

## Architecture

### Data Flow

```
XML string → xml2js.parseStringPromise → Zod validation (XmlKeyboard) → KeyboardData
KeyboardData → xml2js.Builder → XML string
```

The central state is a `KeyboardData` object held in `App.tsx`, passed down to components as props. All edits go through callback props that update state and push to the `HistoryQueue`.

### Key Files

- **`src/lib/data.ts`** — Core data types (`KeyData`, `RowData`, `KeyboardData`), XML import/export logic, Zod schemas. This is the most important file to understand.
- **`src/lib/keyboards.ts`** — Predefined templates (QWERTY, blank) as `KeyboardData` objects.
- **`src/lib/util.ts`** — `HistoryQueue` (undo/redo, 100-state buffer) and `useInitRef` hook.
- **`src/App.tsx`** — Root component; owns all state including `KeyboardData`, undo history, dark mode toggle.
- **`src/components/`** — UI components; dialogs (`KeyDialog`, `RowDialog`, `KeyboardDialog`) are Bootstrap modals controlled via imperative DOM refs.

### Key Concepts

**Key positions**: Each `KeyData` has 9 positions (`key0`–`key8`) representing tap and 8 swipe directions. `key0` is the default/center. `key5` is the shift position.

**XML character escaping**: The app handles Android-specific escaping for characters like `@`, `#`, `\`, `?` in the XML output (see `escapeAndroid` in `data.ts`).

**`Unexpected-Keyboard/`**: A git submodule for the upstream app — used as a reference for the XML schema, not imported as code.
