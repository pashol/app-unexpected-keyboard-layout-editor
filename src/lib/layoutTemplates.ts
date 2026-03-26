import * as xml2js from "xml2js";
import { fromXmlKeyboard, KeyboardData, parseXmlKeyboard } from "./data";

// Eagerly import all layout XML files as raw strings.
// Vite inlines these at build time.
const rawLayouts = import.meta.glob("../layouts/*.xml", {
    query: "?raw",
    eager: true,
}) as Record<string, { default: string }>;

/** A template group containing layouts with a common script/family. */
export interface TemplateGroup {
    /** Display name for the group. */
    group: string;
    /** Templates in this group. */
    templates: Array<{ key: string; keyboard: KeyboardData }>;
}

/** Parse an XML string synchronously using xml2js (SAX is synchronous). */
function parseXmlSync(xmlString: string): KeyboardData | null {
    let parsed: unknown;
    // xml2js.parseString fires its callback synchronously when using the
    // default SAX parser, so this is safe.
    xml2js.parseString(xmlString, (err, result) => {
        if (!err) parsed = result;
    });
    if (parsed === undefined) return null;
    const validated = parseXmlKeyboard(parsed);
    if (typeof validated === "string") {
        console.warn("Failed to parse layout template:", validated);
        return null;
    }
    return fromXmlKeyboard(validated);
}

/** Derive a human-readable group name from a layout filename prefix. */
function groupName(prefix: string): string {
    switch (prefix) {
        case "arab":
            return "Arabic";
        case "armenian":
            return "Armenian";
        case "beng":
            return "Bengali";
        case "cyrl":
            return "Cyrillic";
        case "deva":
            return "Devanagari";
        case "georgian":
            return "Georgian";
        case "grek":
            return "Greek";
        case "guj":
            return "Gujarati";
        case "hang":
            return "Hangul";
        case "hebr":
            return "Hebrew";
        case "kann":
            return "Kannada";
        case "latn":
            return "Latin";
        case "shaw":
            return "Shavian";
        case "sinhala":
            return "Sinhala";
        case "tamil":
            return "Tamil";
        case "urdu":
            return "Urdu";
        default:
            return prefix;
    }
}

function buildTemplateGroups(): TemplateGroup[] {
    const groupMap = new Map<
        string,
        Array<{ key: string; keyboard: KeyboardData }>
    >();

    for (const [path, module] of Object.entries(rawLayouts)) {
        const filename = path.replace(/^.*\//, "").replace(/\.xml$/, "");
        const keyboard = parseXmlSync(module.default);
        if (keyboard === null) continue;

        const prefix = filename.split("_")[0]!;
        const group = groupName(prefix);

        if (!groupMap.has(group)) groupMap.set(group, []);
        groupMap.get(group)!.push({ key: filename, keyboard });
    }

    // Sort groups alphabetically, then sort templates within each group
    return Array.from(groupMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([group, templates]) => ({
            group,
            templates: templates.sort((a, b) =>
                (a.keyboard.name || a.key).localeCompare(
                    b.keyboard.name || b.key,
                ),
            ),
        }));
}

export const templateGroups: TemplateGroup[] = buildTemplateGroups();
