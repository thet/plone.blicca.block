import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { getStyleFieldDefinitionsFromRegistry } from "@plone/helpers";
//#region src/demo-block/data.ts
function text(value) {
	return typeof value === "string" ? value.trim() : "";
}
function warnings(data) {
	const notes = [];
	if (!text(data.title)) notes.push("No title given for the demo block.");
	if (!text(data.description)) notes.push("No description given for the demo block.");
	return notes;
}
//#endregion
//#region src/demo-block/View.tsx
function View({ data = {}, isEditMode }) {
	const title = text(data.title);
	const description = text(data.description);
	return /* @__PURE__ */ jsx("div", {
		className: `demo-block`,
		children: title || description ? /* @__PURE__ */ jsxs("div", {
			className: "demo-block-copy",
			children: [title ? /* @__PURE__ */ jsx("h2", {
				className: "demo-block-title",
				children: title
			}) : null, description ? /* @__PURE__ */ jsx("p", {
				className: "demo-block-description",
				children: description
			}) : null]
		}) : null
	});
}
//#endregion
//#region src/demo-block/Edit.tsx
function Edit(props) {
	const notes = warnings(props.data ?? {});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(View, {
		...props,
		isEditMode: true
	}), notes.map((note) => /* @__PURE__ */ jsx("p", {
		className: "demo-block-notice",
		contentEditable: false,
		children: note
	}, note))] });
}
//#endregion
//#region src/demo-block/Icon.tsx
/**
* Block menu icon.
*/
function Icon(props) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		"aria-hidden": "true",
		focusable: "false",
		...props,
		children: [
			/* @__PURE__ */ jsx("rect", {
				x: "3",
				y: "4.5",
				width: "18",
				height: "15",
				rx: "2"
			}),
			/* @__PURE__ */ jsx("path", { d: "M6.5 8.5h4" }),
			/* @__PURE__ */ jsx("path", { d: "M6.5 11.5h9" }),
			/* @__PURE__ */ jsx("rect", {
				x: "6.5",
				y: "14",
				width: "6",
				height: "3",
				rx: "1.5"
			})
		]
	});
}
//#endregion
//#region src/demo-block/schema.ts
var BLOCK_TYPE = "demo-block";
var BACKGROUND_FIELD_NAME = "backgroundColor";
/**
* Backgrounds from the host's palette - `backgroundField` returns
* `null` if the host registers none.
*/
function backgroundField(data) {
	const choices = getStyleFieldDefinitionsFromRegistry(BACKGROUND_FIELD_NAME, {
		data,
		blockType: BLOCK_TYPE,
		fieldName: BACKGROUND_FIELD_NAME
	}).filter((definition) => typeof definition?.name === "string").map((definition) => [definition.name, definition.label || definition.name]);
	if (!choices.length) return null;
	return {
		title: "Background",
		choices,
		...choices.some(([name]) => name === "none") ? { default: "none" } : {},
		styleField: true
	};
}
function Schema({ formData = {} } = {}) {
	const background = backgroundField(formData);
	return {
		title: "Demo Block",
		fieldsets: [{
			id: "default",
			title: "Default",
			fields: ["title", "description"]
		}, {
			id: "styling",
			title: "Styling",
			fields: ["blockWidth", ...background ? [BACKGROUND_FIELD_NAME] : []]
		}],
		properties: {
			title: { title: "Title" },
			description: {
				title: "Description",
				widget: "textarea"
			},
			blockWidth: {
				title: "Block width",
				widget: "width",
				default: "default",
				styleField: true
			},
			...background ? { [BACKGROUND_FIELD_NAME]: background } : {}
		},
		required: []
	};
}
//#endregion
//#region src/demo-block/index.ts
var BlockInfo = {
	id: BLOCK_TYPE,
	title: "Demo Block",
	edit: Edit,
	view: View,
	blockSchema: Schema,
	icon: Icon,
	category: "demo"
};
//#endregion
//#region src/index.ts
function install(config) {
	config.blocks.blocksConfig[BLOCK_TYPE] = BlockInfo;
	return config;
}
//#endregion
export { install as default };

//# sourceMappingURL=demo-block.js.map