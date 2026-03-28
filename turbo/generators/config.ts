import { existsSync } from "node:fs";
import path from "node:path";

import type { PlopTypes } from "@turbo/gen";

const componentSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const scaffoldTypes = ["content", "layout", "form"] as const;
type ScaffoldType = (typeof scaffoldTypes)[number];

function getComponentSlug(rawValue: unknown): string {
	if (typeof rawValue !== "string") {
		throw new Error("A component name is required.");
	}

	const value = rawValue.trim();

	if (!value) {
		throw new Error("A component name is required.");
	}

	if (!componentSlugPattern.test(value)) {
		throw new Error(
			'Component name must be a lowercase npm-safe slug like "input" or "button-group".',
		);
	}

	return value;
}

function getComponentLabel(rawValue: unknown, fallbackSlug: string): string {
	if (typeof rawValue !== "string") {
		return toDisplayLabel(fallbackSlug);
	}

	const value = rawValue.trim();

	return value.length > 0 ? value : toDisplayLabel(fallbackSlug);
}

function getScaffoldType(rawValue: unknown): ScaffoldType {
	if (typeof rawValue !== "string") {
		throw new Error("A scaffold type is required.");
	}

	const value = rawValue.trim() as ScaffoldType;

	if (!scaffoldTypes.includes(value)) {
		throw new Error("Scaffold type must be one of: content, layout, form.");
	}

	return value;
}

function getSuggestedCategory(rawValue: unknown): string | undefined {
	if (typeof rawValue !== "string") {
		return undefined;
	}

	const value = rawValue.trim();

	if (!value) {
		return undefined;
	}

	if (!componentSlugPattern.test(value)) {
		throw new Error(
			'Suggested category must be a lowercase slug like "forms" or "marketing".',
		);
	}

	return value;
}

function toPascalCase(value: string): string {
	return value
		.split("-")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join("");
}

function toCamelCase(value: string): string {
	const pascalValue = toPascalCase(value);
	return pascalValue.charAt(0).toLowerCase() + pascalValue.slice(1);
}

function toDisplayLabel(value: string): string {
	return value
		.split("-")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
}

function componentExists(value: string): boolean {
	return existsSync(path.resolve("src", value));
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	const templatesRootDir = path.resolve("turbo/generators/templates/component");

	plop.setGenerator("component", {
		description:
			"Create a Puck-native publishable component package in src/<name>",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Component slug",
				validate: (input: string) => {
					try {
						const componentSlug = getComponentSlug(input);

						if (componentExists(componentSlug)) {
							return `src/${componentSlug} already exists.`;
						}

						return true;
					} catch (error) {
						return error instanceof Error
							? error.message
							: "Invalid component name.";
					}
				},
			},
			{
				type: "input",
				name: "label",
				message: "Display label",
				default: (answers?: { name?: string }) => {
					const componentSlug = getComponentSlug(answers?.name);
					return toDisplayLabel(componentSlug);
				},
			},
			{
				type: "list",
				name: "scaffoldType",
				message: "Scaffold type",
				choices: scaffoldTypes.map((value) => ({
					name: value,
					value,
				})),
			},
			{
				type: "input",
				name: "suggestedCategory",
				message: "Suggested category (optional)",
				validate: (input: string) => {
					try {
						getSuggestedCategory(input);
						return true;
					} catch (error) {
						return error instanceof Error ? error.message : "Invalid category.";
					}
				},
			},
		],
		actions: (answers) => {
			const componentSlug = getComponentSlug(answers?.name);
			const componentLabel = getComponentLabel(answers?.label, componentSlug);
			const scaffoldType = getScaffoldType(answers?.scaffoldType);
			const suggestedCategory = getSuggestedCategory(
				answers?.suggestedCategory,
			);

			if (componentExists(componentSlug)) {
				throw new Error(`src/${componentSlug} already exists.`);
			}

			const componentName = toPascalCase(componentSlug);
			const componentVarName = toCamelCase(componentSlug);
			const templatesDir = path.join(templatesRootDir, scaffoldType);
			const templateData = {
				componentName,
				componentLabel,
				componentVarName,
				description: `Anvilkit Puck-native ${componentSlug} component.`,
				name: componentSlug,
				packageName: `@anvilkit/${componentSlug}`,
				scaffoldType,
				suggestedCategory,
			};

			return [
				{
					type: "add",
					path: "src/{{name}}/package.json",
					templateFile: path.join(templatesDir, "package.json"),
					data: templateData,
				},
				{
					type: "add",
					path: "src/{{name}}/README.md",
					templateFile: path.join(templatesDir, "README.md"),
					data: templateData,
				},
				{
					type: "add",
					path: "src/{{name}}/rslib.config.ts",
					templateFile: path.join(templatesDir, "rslib.config.ts"),
					data: templateData,
				},
				{
					type: "add",
					path: "src/{{name}}/tsconfig.json",
					templateFile: path.join(templatesDir, "tsconfig.json"),
					data: templateData,
				},
				{
					type: "add",
					path: "src/{{name}}/src/index.ts",
					templateFile: path.join(templatesDir, "src", "index.ts"),
					data: templateData,
				},
				{
					type: "add",
					path: "src/{{name}}/src/{{componentName}}.tsx",
					templateFile: path.join(templatesDir, "src", "component.tsx"),
					data: templateData,
				},
				{
					type: "add",
					path: "src/{{name}}/src/config.ts",
					templateFile: path.join(templatesDir, "src", "config.ts"),
					data: templateData,
				},
			];
		},
	});
}
