import { KeyboardData } from "./data";

/**
 * Known special key names from KeyValue.java (getSpecialKeyByName).
 * Used to detect typos in key names: any value longer than 3 characters
 * with no ":" that isn't in this set is flagged as unknown.
 */
const KNOWN_SPECIAL_KEYS = new Set([
    "accent_aigu",
    "accent_arrow_right",
    "accent_bar",
    "accent_breve",
    "accent_caron",
    "accent_cedille",
    "accent_circonflexe",
    "accent_dot_above",
    "accent_dot_below",
    "accent_double_aigu",
    "accent_double_grave",
    "accent_grave",
    "accent_hook_above",
    "accent_horn",
    "accent_macron",
    "accent_ogonek",
    "accent_ring",
    "accent_slash",
    "accent_tilde",
    "accent_trema",
    "action",
    "alt",
    "arrows",
    "autofill",
    "b(",
    "b)",
    "b[",
    "b]",
    "backspace",
    "bgt",
    "blt",
    "box",
    "b{",
    "b}",
    "capslock",
    "change_method",
    "change_method_prev",
    "combining_aigu",
    "combining_alef_above",
    "combining_alef_below",
    "combining_arabic_inverted_v",
    "combining_arabic_v",
    "combining_arrow_right",
    "combining_bar",
    "combining_breve",
    "combining_caron",
    "combining_cedille",
    "combining_circonflexe",
    "combining_dammah",
    "combining_dammatan",
    "combining_dot_above",
    "combining_dot_below",
    "combining_double_aigu",
    "combining_fatha",
    "combining_fathatan",
    "combining_grave",
    "combining_hamza_above",
    "combining_hamza_below",
    "combining_hook_above",
    "combining_horn",
    "combining_inverted_breve",
    "combining_kasra",
    "combining_kasratan",
    "combining_kavyka",
    "combining_macron",
    "combining_ogonek",
    "combining_palatalization",
    "combining_payerok",
    "combining_pokrytie",
    "combining_ring",
    "combining_shaddah",
    "combining_slash",
    "combining_slavonic_dasia",
    "combining_slavonic_psili",
    "combining_sukun",
    "combining_tilde",
    "combining_titlo",
    "combining_trema",
    "combining_vertical_tilde",
    "combining_vzmet",
    "compose",
    "compose_cancel",
    "config",
    "copy",
    "ctrl",
    "cursor_down",
    "cursor_left",
    "cursor_right",
    "cursor_up",
    "cut",
    "dagesh",
    "delete",
    "delete_word",
    "down",
    "end",
    "enter",
    "esc",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f10",
    "f11",
    "f12",
    "f11_placeholder",
    "f12_placeholder",
    "fn",
    "forward_delete_word",
    "geresh",
    "gershayim",
    "halfspace",
    "hataf_patah",
    "hataf_qamats",
    "hataf_segol",
    "hiriq",
    "holam",
    "home",
    "insert",
    "left",
    "lrm",
    "maqaf",
    "menu",
    "meta",
    "meteg",
    "meteg_placeholder",
    "nbsp",
    "nnbsp",
    "ole",
    "ole_placeholder",
    "ordinal",
    "page_down",
    "page_up",
    "paste",
    "pasteAsPlainText",
    "patah",
    "qamats",
    "qubuts",
    "rafe",
    "redo",
    "removed",
    "replaceText",
    "right",
    "rlm",
    "scroll_lock",
    "segol",
    "selectAll",
    "selection_cancel",
    "selection_cursor_left",
    "selection_cursor_right",
    "selection_mode",
    "shareText",
    "sheva",
    "shift",
    "shindot",
    "shindot_placeholder",
    "sindot",
    "sindot_placeholder",
    "space",
    "subscript",
    "superscript",
    "switch_back_clipboard",
    "switch_back_emoji",
    "switch_backward",
    "switch_clipboard",
    "switch_emoji",
    "switch_forward",
    "switch_greekmath",
    "switch_numeric",
    "switch_text",
    "tab",
    "textAssist",
    "tsere",
    "undo",
    "up",
    "voice_typing",
    "voice_typing_chooser",
    "zwj",
    "zwnj",
]);

/**
 * Key values present in the built-in bottom row (res/xml/bottom_row.xml),
 * with android `\` escape prefix stripped, as they appear after parsing.
 * Includes "loc " prefixed entries.
 */
const BOTTOM_ROW_KEYS = new Set([
    "ctrl",
    "loc switch_greekmath",
    "loc meta",
    "loc switch_clipboard",
    "switch_numeric",
    "fn",
    "loc alt",
    "loc change_method",
    "switch_emoji",
    "config",
    "space",
    "switch_forward",
    "switch_backward",
    "cursor_left",
    "cursor_right",
    "loc compose",
    "up",
    "right",
    "left",
    "down",
    "loc home",
    "loc page_up",
    "loc end",
    "loc page_down",
    "enter",
    "loc voice_typing",
    "action",
]);

const PROHIBITED_EDITING_KEYS = [
    "copy",
    "paste",
    "cut",
    "selectAll",
    "shareText",
    "pasteAsPlainText",
    "undo",
    "redo",
];

const FUNCTION_KEYS = [
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f10",
    "f11",
    "f12",
];

const AUTO_ADDED_KEYS = ["f11_placeholder", "f12_placeholder"];

const ASCII_PUNCT = Array.from(`~!@#$%^&*(){}\`[]=\\-_;:/.,?<>'"+|`);
const DIGITS = Array.from("0123456789");

const KEY_POSITION_NAMES: Record<string, string> = {
    key0: "center",
    key1: "top-left",
    key2: "top-right",
    key3: "bottom-left",
    key4: "bottom-right",
    key5: "left",
    key6: "right",
    key7: "top",
    key8: "bottom",
};

interface KeyLocation {
    value: string;
    row: number;
    key: number;
    position: string;
}

/** Collect all non-empty key values with their locations. */
function collectKeyLocations(data: KeyboardData): KeyLocation[] {
    const locations: KeyLocation[] = [];
    data.rows.forEach((row, rowIdx) => {
        row.keys.forEach((key, keyIdx) => {
            for (const pos of Object.keys(KEY_POSITION_NAMES) as Array<
                keyof typeof KEY_POSITION_NAMES
            >) {
                const v = key[pos as keyof typeof key] as string;
                if (v !== "")
                    locations.push({
                        value: v,
                        row: rowIdx + 1,
                        key: keyIdx + 1,
                        position: KEY_POSITION_NAMES[pos]!,
                    });
            }
        });
    });
    return locations;
}

/**
 * Validate a keyboard layout against the same rules as check_layout.py
 * in pashol/Unexpected-Keyboard. Returns a list of warning strings.
 */
export function validateKeyboard(data: KeyboardData): string[] {
    const warnings: string[] = [];
    const locations = collectKeyLocations(data);
    const allKeys = locations.map((l) => l.value);
    const keySet = new Set(allKeys);

    // Duplicate keys — report each duplicate value with all its locations
    const seen = new Map<string, KeyLocation[]>();
    for (const loc of locations) {
        const existing = seen.get(loc.value);
        if (existing) existing.push(loc);
        else seen.set(loc.value, [loc]);
    }
    for (const [value, locs] of [...seen].sort(([a], [b]) =>
        a.localeCompare(b),
    )) {
        if (locs.length > 1) {
            const places = locs
                .map((l) => `row ${l.row} key ${l.key} ${l.position}`)
                .join(", ");
            warnings.push(`Duplicate key "${value}": ${places}`);
        }
    }

    // Missing some but not all ASCII punctuation
    const missingPunct = ASCII_PUNCT.filter((c) => !keySet.has(c));
    if (missingPunct.length > 0 && missingPunct.length < ASCII_PUNCT.length)
        warnings.push(
            `Layout includes some ASCII punctuation but not all, missing: ${missingPunct.sort().join(", ")}`,
        );

    // Missing some but not all digits
    const missingDigits = DIGITS.filter((d) => !keySet.has(d));
    if (missingDigits.length > 0 && missingDigits.length < DIGITS.length)
        warnings.push(
            `Layout includes some digits but not all, missing: ${missingDigits.sort().join(", ")}`,
        );

    // Required: backspace and delete
    const missingImportant = ["backspace", "delete"].filter(
        (k) => !keySet.has(k),
    );
    if (missingImportant.length > 0)
        warnings.push(
            `Layout doesn't define some important keys, missing: ${missingImportant.join(", ")}`,
        );

    // Prohibited: editing keys
    const foundEditing = PROHIBITED_EDITING_KEYS.filter((k) => keySet.has(k));
    if (foundEditing.length > 0)
        warnings.push(
            `Layout contains editing keys: ${foundEditing.sort().join(", ")}`,
        );

    // Prohibited: function keys
    const foundFn = FUNCTION_KEYS.filter((k) => keySet.has(k));
    if (foundFn.length > 0)
        warnings.push(`Layout contains function keys: ${foundFn.join(", ")}`);

    // Auto-added placeholders
    const foundAuto = AUTO_ADDED_KEYS.filter((k) => keySet.has(k));
    if (foundAuto.length > 0)
        warnings.push(
            `These keys are added automatically, remove them: ${foundAuto.join(", ")}`,
        );

    // "loc" used as a plain symbol
    if (keySet.has("loc"))
        warnings.push(`Special keyword "loc" cannot be used as a symbol`);

    // Keys with leading/trailing whitespace
    const keysWithWS = allKeys.filter((k) => k !== k.trim());
    if (keysWithWS.length > 0)
        warnings.push(
            `Some keys contain leading/trailing whitespace: ${keysWithWS.join(", ")}`,
        );

    // Latin script requirements (script defaults to "latin" when unset)
    if (data.script === "" || data.script === "latin") {
        const missingLatin = ["shift", "loc capslock"].filter(
            (k) => !keySet.has(k),
        );
        if (missingLatin.length > 0)
            warnings.push(`Missing important keys: ${missingLatin.join(", ")}`);
        const missingProg = ["loc esc", "loc tab"].filter(
            (k) => !keySet.has(k),
        );
        if (missingProg.length > 0)
            warnings.push(
                `Missing programming keys: ${missingProg.join(", ")}`,
            );
    }

    // Bottom row consistency
    if (!data.bottomRow) {
        // Custom bottom row: must include all built-in bottom row keys
        const missingBR = [...BOTTOM_ROW_KEYS].filter((k) => !keySet.has(k));
        if (missingBR.length > 0)
            warnings.push(
                `Layout redefines the bottom row but some important keys are missing: ${missingBR.sort().join(", ")}`,
            );
    } else {
        // Using built-in bottom row: must not duplicate its keys
        const unexpectedBR = [...BOTTOM_ROW_KEYS].filter((k) => keySet.has(k));
        if (unexpectedBR.length > 0)
            warnings.push(
                `Layout contains keys already in the built-in bottom row: ${unexpectedBR.sort().join(", ")}`,
            );
    }

    // Missing script declaration
    if (data.script === "") warnings.push("Layout doesn't specify a script");

    // Unknown special key names (length > 3, no ":", not in known set)
    const keysWithoutLoc = allKeys.map((k) =>
        k.startsWith("loc ") ? k.slice(4) : k,
    );
    const unknownKeys = [
        ...new Set(
            keysWithoutLoc.filter(
                (k) =>
                    k.length > 3 &&
                    !k.includes(":") &&
                    !KNOWN_SPECIAL_KEYS.has(k),
            ),
        ),
    ];
    if (unknownKeys.length > 0)
        warnings.push(
            `Layout contains unknown keys: ${unknownKeys.sort().join(", ")}`,
        );

    return warnings;
}
