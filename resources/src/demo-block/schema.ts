import { getStyleFieldDefinitionsFromRegistry } from "@plone/helpers";
export const BLOCK_TYPE = "demo-block";

const BACKGROUND_FIELD_NAME = "backgroundColor";

/**
 * Backgrounds from the host's palette - `backgroundField` returns
 * `null` if the host registers none.
 */
function backgroundField(data: Record<string, unknown>) {
  const definitions = getStyleFieldDefinitionsFromRegistry(BACKGROUND_FIELD_NAME, {
    data,
    blockType: BLOCK_TYPE,
    fieldName: BACKGROUND_FIELD_NAME,
  }) as Array<{ name?: unknown; label?: unknown }>;
  const choices = definitions
    .filter((definition) => typeof definition?.name === "string")
    .map((definition) => [definition.name, definition.label || definition.name]);
  if (!choices.length) return null;
  return {
    title: "Background",
    choices,
    ...(choices.some(([name]) => name === "none") ? { default: "none" } : {}),
    styleField: true,
  };
}

export function Schema({ formData = {} }: { formData?: Record<string, unknown> } = {}) {
  const background = backgroundField(formData);

  return {
    title: "Demo Block",
    fieldsets: [
      {
        id: "default",
        title: "Default",
        fields: ["title", "description"],
      },
      {
        id: "styling",
        title: "Styling",
        fields: ["blockWidth", ...(background ? [BACKGROUND_FIELD_NAME] : [])],
      },
    ],
    properties: {
      title: { title: "Title" },
      // Generic textarea registered by plone.blicca.auroraeditor.
      description: { title: "Description", widget: "textarea" },
      blockWidth: {
        title: "Block width",
        widget: "width",
        default: "default",
        styleField: true,
      },
      ...(background ? { [BACKGROUND_FIELD_NAME]: background } : {}),
    },
    required: [],
  };
}

export default Schema;
