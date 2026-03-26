import { JSX } from "preact/jsx-runtime";

/** Props for the KeyLegend component */
export interface KeyLegendProps {
    /** The legend to display */
    legend: string;
    /** The class to apply to the legend */
    class?: string;
}

// Names sourced from https://github.com/pashol/Unexpected-Keyboard/blob/master/srcs/juloo.keyboard2/KeyValue.java

/** Mapping of legends to bootstrap icons */
const legendIcons: Record<string, string> = {
    // Navigation
    shift: "shift-fill",
    capslock: "capslock-fill",
    enter: "arrow-return-left",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    page_up: "arrow-up-circle-fill",
    page_down: "arrow-down-circle-fill",
    home: "arrow-left-circle-fill",
    end: "arrow-right-circle-fill",
    backspace: "backspace-fill",
    delete: "backspace-reverse-fill",
    tab: "indent",
    // Cursor movement (slider keys)
    cursor_left: "arrow-left",
    cursor_right: "arrow-right",
    cursor_up: "arrow-up",
    cursor_down: "arrow-down",
    selection_cursor_left: "arrow-bar-left",
    selection_cursor_right: "arrow-bar-right",
    // Editing
    copy: "files",
    cut: "scissors",
    paste: "clipboard-data",
    pasteAsPlainText: "clipboard",
    selectAll: "check2-circle",
    undo: "arrow-counterclockwise",
    redo: "arrow-clockwise",
    delete_word: "eraser",
    forward_delete_word: "eraser-fill",
    shareText: "box-arrow-up",
    textAssist: "stars",
    // Keyboard switching
    config: "gear-fill",
    switch_emoji: "emoji-smile",
    switch_clipboard: "clipboard2",
    switch_forward: "skip-forward",
    switch_backward: "skip-backward",
    change_method: "globe",
    change_method_prev: "globe",
    voice_typing: "mic-fill",
    voice_typing_chooser: "mic-fill",
};

/** Mapping of legends to strings */
const legendStrings: Record<string, string> = {
    // Modifiers
    ctrl: "Ctrl",
    alt: "Alt",
    fn: "Fn",
    meta: "Meta",
    superscript: "Sup",
    subscript: "Sub",
    ordinal: "Ord",
    arrows: "Arr",
    box: "Box",
    // Keyboard switching
    switch_text: "ABC",
    switch_numeric: "123+",
    switch_back_emoji: "ABC",
    switch_back_clipboard: "ABC",
    switch_greekmath: "πλ∇¬",
    // Navigation labels
    esc: "Esc",
    insert: "Ins",
    menu: "Menu",
    scroll_lock: "Scrl",
    action: "Action",
    // Selection
    selection_cancel: "Esc",
    selection_mode: "Sel",
    // Editing labels
    replaceText: "repl",
    autofill: "auto",
    // Compose
    compose: "⎄",
    compose_cancel: "⊗",
    // Whitespace / invisible characters
    space: "Space",
    nbsp: "⍽",
    nnbsp: "⎵",
    lrm: "↱",
    rlm: "↰",
    zwj: "ZWJ",
    zwnj: "ZWNJ",
    halfspace: "ZWNJ",
    // Function keys
    f1: "F1",
    f2: "F2",
    f3: "F3",
    f4: "F4",
    f5: "F5",
    f6: "F6",
    f7: "F7",
    f8: "F8",
    f9: "F9",
    f10: "F10",
    f11: "F11",
    f12: "F12",
    f11_placeholder: "F11",
    f12_placeholder: "F12",
    // Diacritics (dead keys)
    accent_aigu: "◌́",
    accent_grave: "◌̀",
    accent_double_aigu: "◌̋",
    accent_double_grave: "◌̏",
    accent_dot_above: "◌̇",
    accent_dot_below: "◌̣",
    accent_circonflexe: "◌̂",
    accent_tilde: "◌̃",
    accent_cedille: "◌̧",
    accent_trema: "◌̈",
    accent_ring: "◌̊",
    accent_caron: "◌̌",
    accent_macron: "◌̄",
    accent_ogonek: "◌̨",
    accent_breve: "◌̆",
    accent_slash: "◌̷",
    accent_bar: "◌̄",
    accent_hook_above: "◌̉",
    accent_horn: "◌̛",
    accent_arrow_right: "◌⃗",
};

/** A single piece of display text for a center / corner of a key */
export function KeyLegend(props: KeyLegendProps) {
    let str = props.legend;
    let cls = props.class;

    // If the str begins with "loc", it's a placeholder for a possible key,
    // so remove the "loc" prefix, and show it differently
    if (str.startsWith("loc ")) {
        str = str.substring(4);
        cls = (cls || "") + " text-dark";
    }

    // Also special case the "f11_placeholder" and "f12_placeholder" legends
    if (str === "f11_placeholder" || str === "f12_placeholder") {
        cls = (cls || "") + " text-dark";
    }

    let content: string | JSX.Element = str;

    if (str in legendStrings) {
        content = legendStrings[str]!;
    } else if (str in legendIcons) {
        content = <i class={`bi bi-${legendIcons[str]}`} />;
    }

    return <span class={cls}>{content}</span>;
}
