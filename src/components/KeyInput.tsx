import { useEffect, useRef, useState } from "preact/hooks";

/** Props for the KeyInput component */
export interface KeyInputProps {
    /** The input value */
    input: string;
    /** Callback to update the input value */
    updateInput: (input: string) => void;
}

const specialKeys = [
    // modifiers: [
    "shift",
    "ctrl",
    "alt",
    "superscript",
    "subscript",
    "ordinal",
    "arrows",
    "box",
    "fn",
    "meta",
    // ],
    // diacritics: [
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
    // ],
    // modes: [
    "change_method",
    "change_method_prev",
    "compose",
    "compose_cancel",
    "config",
    "switch_back_clipboard",
    "switch_back_emoji",
    "switch_backward",
    "switch_clipboard",
    "switch_emoji",
    "switch_forward",
    "switch_greekmath",
    "switch_numeric",
    "switch_text",
    "voice_typing",
    "voice_typing_chooser",
    // ],
    // common: [
    "action",
    "capslock",
    "cursor_down",
    "cursor_left",
    "cursor_right",
    "cursor_up",
    "delete_word",
    "end",
    "enter",
    "esc",
    "forward_delete_word",
    "backspace",
    "delete",
    "down",
    "home",
    "insert",
    "left",
    "menu",
    "page_down",
    "page_up",
    "right",
    "scroll_lock",
    "selection_cancel",
    "selection_cursor_left",
    "selection_cursor_right",
    "selection_mode",
    "tab",
    "up",
    // ],
    // whitespace: [
    "space",
    "nbsp",
    "nnbsp",
    "halfspace",
    "zwj",
    "zwnj",
    "\\n",
    "\\t",
    // ],
    // function_keys: [
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
    // ],
    // bidi: [
    "b(",
    "b)",
    "b[",
    "b]",
    "b{",
    "b}",
    "bgt",
    "blt",
    "lrm",
    "rlm",
    // ],
    // combining: [
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
    // ],
    // hebrew: [
    "dagesh",
    "geresh",
    "gershayim",
    "hataf_patah",
    "hataf_qamats",
    "hataf_segol",
    "hiriq",
    "holam",
    "maqaf",
    "meteg",
    "meteg_placeholder",
    "ole",
    "ole_placeholder",
    "patah",
    "qamats",
    "qubuts",
    "rafe",
    "segol",
    "sheva",
    "shindot",
    "shindot_placeholder",
    "sindot",
    "sindot_placeholder",
    "tsere",
    // ],
    // actions: [
    "copy",
    "cut",
    "paste",
    "pasteAsPlainText",
    "redo",
    "replaceText",
    "selectAll",
    "shareText",
    "textAssist",
    "autofill",
    "undo",
    "removed",
    // ],
];

/** An input for modifying a central or corner key */
export function KeyInput(props: KeyInputProps) {
    const [autoComplete, setAutoComplete] = useState<string[]>([]);
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const autoCompleteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add a click listener to the document to hide the autocomplete
        // suggestions when the user clicks outside the suggestions
        const listener = () => {
            setShowAutoComplete(false);
        };
        document.addEventListener("click", listener);
        return () => document.removeEventListener("click", listener);
    }, []);

    return (
        <div class="position-relative">
            <input
                class="form-control"
                type="text"
                value={props.input ?? ""}
                onInput={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    let input = value.trim().toLocaleLowerCase();
                    // Strip "loc " from the beginning of the input
                    if (input.startsWith("loc ")) {
                        input = input.slice(4);
                    }
                    if (input.length === 0) {
                        setAutoComplete([]);
                    } else {
                        setAutoComplete(
                            specialKeys.filter((key) =>
                                key.startsWith(input.toLowerCase()),
                            ),
                        );
                    }
                    setShowAutoComplete(true);
                    props.updateInput(value);
                }}
                onFocus={() => setShowAutoComplete(true)}
                onClick={(e) => e.stopPropagation()}
            />
            {autoComplete.length > 0 && showAutoComplete && (
                <div
                    class="position-absolute w-100 top-100 list-group"
                    style={{ zIndex: 1 }}
                    ref={autoCompleteRef}
                >
                    {autoComplete.map((key, i) => (
                        <button
                            class="list-group-item list-group-item-action"
                            onClick={() => {
                                props.updateInput(
                                    (props.input.startsWith("loc ")
                                        ? "loc "
                                        : "") + key,
                                );
                                setAutoComplete([]);
                            }}
                            key={i}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
