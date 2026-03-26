# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based editor for creating and editing keyboard layouts for the [pashol/Unexpected-Keyboard](https://github.com/pashol/Unexpected-Keyboard) Android app (a fork of Julow/Unexpected-Keyboard). It imports/exports the XML format used by that app.

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

**Key positions**: Each `KeyData` has 9 positions representing tap and 8 swipe directions, stored internally as `key0`–`key8`. The mapping to the upstream XML compass format is:

```
key1(nw)  key7(n)  key2(ne)
key5(w)   key0(c)  key6(e)
key3(sw)  key8(s)  key4(se)
```

**XML format gap**: The editor reads and writes the `key0`–`key8` attribute format. The upstream project's user-facing layouts (in `srcs/layouts/`) use compass direction attributes (`c`, `nw`, `n`, `ne`, `w`, `e`, `sw`, `s`, `se`). The editor does not currently parse or emit the compass format.

**Upstream XML format** (for reference when extending the editor):
- `<keyboard name="..." script="..." bottom_row="false">` — `bottom_row` defaults to true
- `<row height="0.95">` — height defaults to 1
- `<key c="a" nw="!" ne="1" sw="loc §" width="1.5" shift="0.5">` — `width` defaults to 1, `shift` (left padding) defaults to 0
- `loc ` prefix on a key value marks it as hidden unless needed by "Add keys to keyboard"
- Special key values: `shift`, `backspace`, `enter`, `space`, `fn`, `ctrl`, `alt`, `action`, `switch_numeric`, `switch_text`, `switch_emoji`, `capslock`, `compose`, and accent modifiers like `accent_aigu`. Full list in [upstream doc](https://github.com/pashol/Unexpected-Keyboard/blob/master/doc/Possible-key-values.md).
- Android XML escaping: `@`, `#`, `\`, `?` must be prefixed with `\` in layout files included in the app (but not in custom layouts loaded by users).

**`Unexpected-Keyboard/`**: A git submodule for the upstream app — used as a reference for the XML schema, not imported as code.
