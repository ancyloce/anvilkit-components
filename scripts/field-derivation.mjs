/**
 * PLAN-0036 P1-02 (M3) — shadcn field-derivation core.
 *
 * Derives the exact literal unions authorable wrappers expose as Puck
 * `select`/`radio` options straight from the vendored `@anvilkit/ui`
 * sources, so a shadcn upstream bump can never silently desync a wrapper's
 * option list from the component it actually renders.
 *
 * Two extraction kinds, per DOC-01 §4 (`docs/designs/0001-wrapper-field-
 * mapping-spec-0814-1535.md`) — only 4 of the 18 vendored files carry cva
 * axes, and 4 more carry plain literal-union props:
 *
 *   kind "cva"        — value keys of `<export>.variants.<axis>`
 *   kind "prop-union" — literal members of prop `<prop>` on `function <component>`
 *
 * A manifest row's optional `exclude` list drops values from the *generated
 * field options* only — `<field>SourceValues` always carries the complete
 * source union, so an upstream change to a curated-out value still trips the
 * drift gate (DOC-01 §6 semantics).
 *
 * IO is fully parameterized (`uiSrcDir` / `workspaceDir`) so the drift gate
 * can be exercised against injected fixtures in `tests/fields-drift.test.ts`
 * rather than only against the live tree.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";

const require = createRequire(import.meta.url);

export const GENERATOR = "scripts/derive-shadcn-fields.mjs";

/**
 * The vendored sources are TypeScript, and the two shapes read here (a cva
 * `variants` object literal, a literal-union prop inside an intersection
 * type) sit behind Tailwind class strings full of braces and brackets — so
 * this is a real parse, never a regex.
 *
 * No new dependency: the classic compiler API is borrowed from `typedoc`'s
 * own `typescript`, which `pnpm-workspace.yaml` pins to 6.0.3 (the
 * `"typedoc>typescript"` override). The workspace's top-level
 * `typescript@7.0.2` is the native tsgo build and exposes no `createSourceFile`.
 *
 * @returns {typeof import("typescript")} classic compiler API
 */
export function loadClassicTypeScript() {
	const direct = require("typescript");
	if (typeof direct.createSourceFile === "function") return direct;
	try {
		const viaTypedoc = createRequire(require.resolve("typedoc/package.json"));
		const ts = viaTypedoc("typescript");
		if (typeof ts.createSourceFile === "function") return ts;
	} catch {
		// fall through to the actionable error below
	}
	throw new Error(
		"no classic TypeScript compiler available: the workspace `typescript` is " +
			"the native tsgo build (no createSourceFile) and `typedoc`'s pinned " +
			'typescript could not be resolved. Check the "typedoc>typescript" ' +
			"override in pnpm-workspace.yaml, then re-run.",
	);
}

const ts = loadClassicTypeScript();

function parse(sourcePath, sourceText) {
	return ts.createSourceFile(
		sourcePath,
		sourceText,
		ts.ScriptTarget.Latest,
		/* setParentNodes */ true,
		ts.ScriptKind.TSX,
	);
}

/** Property key as written, for both `identifier:` and `"quoted":` forms. */
function propertyName(node) {
	if (ts.isIdentifier(node.name)) return node.name.text;
	if (ts.isStringLiteral(node.name)) return node.name.text;
	return null;
}

function findObjectProperty(objectLiteral, name) {
	for (const member of objectLiteral.properties) {
		if (ts.isPropertyAssignment(member) && propertyName(member) === name) {
			return member.initializer;
		}
	}
	return null;
}

/**
 * `const <name> = cva("base", { variants: { <axis>: { <value>: … } } })`
 *
 * @returns {Map<string, string[]>} axis -> ordered value list
 */
export function extractCvaAxes(sourceFile, exportName, sourceLabel) {
	let call = null;
	const visit = (node) => {
		if (
			ts.isVariableDeclaration(node) &&
			ts.isIdentifier(node.name) &&
			node.name.text === exportName &&
			node.initializer &&
			ts.isCallExpression(node.initializer)
		) {
			call = node.initializer;
			return;
		}
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);

	if (!call) {
		throw new Error(
			`${sourceLabel}: no \`const ${exportName} = …\` call found`,
		);
	}
	const callee = call.expression;
	if (!ts.isIdentifier(callee) || callee.text !== "cva") {
		throw new Error(
			`${sourceLabel}: \`${exportName}\` is not a cva() call (found \`${callee.getText(sourceFile)}\`)`,
		);
	}
	const config = call.arguments[1];
	if (!config || !ts.isObjectLiteralExpression(config)) {
		throw new Error(
			`${sourceLabel}: \`${exportName}\` has no cva config object`,
		);
	}
	const variants = findObjectProperty(config, "variants");
	if (!variants || !ts.isObjectLiteralExpression(variants)) {
		throw new Error(
			`${sourceLabel}: \`${exportName}\` config has no \`variants\` object`,
		);
	}

	const axes = new Map();
	for (const member of variants.properties) {
		if (!ts.isPropertyAssignment(member)) continue;
		const axis = propertyName(member);
		if (axis === null) continue;
		if (!ts.isObjectLiteralExpression(member.initializer)) continue;
		const values = [];
		for (const valueMember of member.initializer.properties) {
			if (!ts.isPropertyAssignment(valueMember)) continue;
			const value = propertyName(valueMember);
			if (value !== null) values.push(value);
		}
		axes.set(axis, values);
	}
	return axes;
}

/** Collect every `{ … }` type literal reachable from a parameter's type. */
function collectTypeLiterals(typeNode, out) {
	if (!typeNode) return out;
	if (ts.isTypeLiteralNode(typeNode)) out.push(typeNode);
	if (ts.isIntersectionTypeNode(typeNode) || ts.isUnionTypeNode(typeNode)) {
		for (const member of typeNode.types) collectTypeLiterals(member, out);
	}
	if (ts.isParenthesizedTypeNode(typeNode))
		collectTypeLiterals(typeNode.type, out);
	return out;
}

/**
 * `function <component>({ … }: SomeProps & { <prop>?: "a" | "b" })`
 *
 * @returns {Map<string, string[]>} prop -> ordered literal list
 */
export function extractPropUnions(sourceFile, componentName, sourceLabel) {
	let fn = null;
	const visit = (node) => {
		if (ts.isFunctionDeclaration(node) && node.name?.text === componentName) {
			fn = node;
			return;
		}
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);

	if (!fn) {
		throw new Error(
			`${sourceLabel}: no \`function ${componentName}(…)\` declaration found`,
		);
	}
	const parameter = fn.parameters[0];
	if (!parameter?.type) {
		throw new Error(
			`${sourceLabel}: \`${componentName}\` has no typed props parameter`,
		);
	}

	const props = new Map();
	for (const literal of collectTypeLiterals(parameter.type, [])) {
		for (const member of literal.members) {
			if (!ts.isPropertySignature(member) || !member.type) continue;
			const name = propertyName(member);
			if (name === null) continue;
			const unionMembers = ts.isUnionTypeNode(member.type)
				? member.type.types
				: [member.type];
			const values = [];
			let literalOnly = true;
			for (const entry of unionMembers) {
				if (ts.isLiteralTypeNode(entry) && ts.isStringLiteral(entry.literal)) {
					values.push(entry.literal.text);
				} else if (entry.kind !== ts.SyntaxKind.UndefinedKeyword) {
					literalOnly = false;
				}
			}
			if (literalOnly && values.length > 0) props.set(name, values);
		}
	}
	return props;
}

function pascalCase(value) {
	return value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join("");
}

function serializeArray(values) {
	const inline = `[${values.map((value) => JSON.stringify(value)).join(", ")}] as const`;
	// Biome wraps at 80 columns; mirror its multiline form so `pnpm format`
	// can never introduce phantom drift into committed goldens.
	if (inline.length <= 62) return inline;
	return `[\n${values.map((value) => `\t${JSON.stringify(value)},`).join("\n")}\n] as const`;
}

/** @returns {string} the exact `fields.gen.ts` contents for one manifest row */
export function renderGolden(target, axes) {
	const lines = [
		"// GENERATED FILE — DO NOT EDIT.",
		`// Source: @anvilkit/ui \`src/${target.source}\``,
		`// Generator: \`${GENERATOR}\` (manifest: \`scripts/shadcn-field-targets.json\`)`,
		"// Regenerate: `pnpm gen:fields` (from packages/extensions/components/)",
		"//",
		"// `<field>SourceValues` is the COMPLETE union as it exists upstream and is",
		"// what `check:fields-drift` compares; `<field>Options` is the authorable",
		"// subset after the DOC-01 curation recorded in the manifest's `exclude`.",
		"",
	];

	for (const axis of axes) {
		lines.push(
			`/** Complete \`${axis.sourceKey}\` union from \`${target.source}\` (drift-tracked). */`,
			`export const ${axis.field}SourceValues = ${serializeArray(axis.sourceValues)};`,
			"",
			axis.exclude.length > 0
				? `/** Authorable subset — curated out: ${axis.exclude.map((value) => `\`${value}\``).join(", ")}. */`
				: "/** Authorable options (no curation for this axis). */",
			`export const ${axis.field}Options = ${serializeArray(axis.options)};`,
			"",
			`export type ${pascalCase(axis.field)} = (typeof ${axis.field}Options)[number];`,
			"",
		);
	}

	return `${lines.join("\n").trimEnd()}\n`;
}

/**
 * Derive every manifest row against a source tree.
 *
 * @param {object} options
 * @param {{ targets: object[] }} options.manifest
 * @param {string} options.uiSrcDir      vendored `@anvilkit/ui` `src/`
 * @param {string} options.workspaceDir  components workspace root
 * @param {boolean} [options.check]      report drift instead of writing
 * @returns {{ written: string[], unchanged: string[], drifted: {file:string,reason:string}[],
 *             skipped: string[], errors: string[] }}
 */
export function deriveFields({
	manifest,
	uiSrcDir,
	workspaceDir,
	check = false,
}) {
	if (!Array.isArray(manifest?.targets) || manifest.targets.length === 0) {
		throw new Error(
			"shadcn-field-targets.json: `targets` must be a non-empty array",
		);
	}

	const written = [];
	const unchanged = [];
	const drifted = [];
	const skipped = [];
	const errors = [];

	for (const target of manifest.targets) {
		const sourcePath = join(uiSrcDir, target.source);
		const sourceLabel = `@anvilkit/ui src/${target.source}`;
		if (!existsSync(sourcePath)) {
			errors.push(`${sourceLabel}: vendored source is missing`);
			continue;
		}

		let extracted;
		try {
			const sourceFile = parse(sourcePath, readFileSync(sourcePath, "utf8"));
			extracted =
				target.kind === "cva"
					? extractCvaAxes(sourceFile, target.export, sourceLabel)
					: extractPropUnions(sourceFile, target.component, sourceLabel);
		} catch (error) {
			errors.push(error.message);
			continue;
		}

		const axes = [];
		for (const axis of target.axes) {
			const sourceKey = target.kind === "cva" ? axis.axis : axis.prop;
			const sourceValues = extracted.get(sourceKey);
			if (!sourceValues) {
				errors.push(
					`${sourceLabel}: ${target.kind === "cva" ? "cva axis" : "prop"} \`${sourceKey}\` not found — ` +
						`upstream removed or renamed it (manifest field \`${target.package}.${axis.field}\`)`,
				);
				continue;
			}
			const exclude = axis.exclude ?? [];
			const unknown = exclude.filter((value) => !sourceValues.includes(value));
			if (unknown.length > 0) {
				errors.push(
					`${sourceLabel}: manifest \`exclude\` for \`${target.package}.${axis.field}\` lists ` +
						`value(s) absent upstream: ${unknown.join(", ")}`,
				);
				continue;
			}
			const options = sourceValues.filter((value) => !exclude.includes(value));
			if (options.length === 0) {
				errors.push(
					`${sourceLabel}: \`${target.package}.${axis.field}\` curated down to zero options`,
				);
				continue;
			}
			axes.push({ ...axis, sourceKey, sourceValues, options, exclude });
		}
		if (axes.length !== target.axes.length) continue;

		const packageDir = join(workspaceDir, "src", target.package);
		if (!existsSync(packageDir)) {
			// Wrapper packages land across PLAN-0036 P1-04..06; report loudly
			// rather than silently narrowing the gate's coverage.
			skipped.push(`${target.package} (package not scaffolded yet)`);
			continue;
		}

		const outPath = join(packageDir, "src", "generated", "fields.gen.ts");
		const next = renderGolden(target, axes);
		const current = existsSync(outPath) ? readFileSync(outPath, "utf8") : null;
		const rel = relative(workspaceDir, outPath);

		if (current === next) {
			unchanged.push(rel);
		} else if (check) {
			drifted.push({
				file: rel,
				reason:
					current === null
						? "golden missing"
						: "golden differs from upstream source",
			});
		} else {
			mkdirSync(dirname(outPath), { recursive: true });
			writeFileSync(outPath, next);
			written.push(rel);
		}
	}

	return { written, unchanged, drifted, skipped, errors };
}
