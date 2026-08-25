import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export type CodeLanguage =
	| "plain"
	| "html"
	| "css"
	| "javascript"
	| "typescript"
	| "json"
	| "shell";

export interface CodeProps {
	code: string;
	language?: CodeLanguage;
	showLineNumbers?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface CodeViewProps extends CodeProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`code`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

export function Code({
	code,
	language = "plain",
	showLineNumbers = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: CodeViewProps) {
	const anim = animationAttrs(animation);
	const lineOccurrences = new Map<string, number>();
	const lines = code.split("\n").map((line) => {
		const occurrence = (lineOccurrences.get(line) ?? 0) + 1;
		lineOccurrences.set(line, occurrence);
		return { key: `${line}-${occurrence}`, line };
	});

	return (
		<pre
			{...rootAttrs}
			className={cn(
				"overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-foreground",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<code
				{...targetAttrs?.code}
				data-language={language}
				className={cn("font-mono text-sm leading-6", classNames?.code)}
			>
				{showLineNumbers
					? lines.map(({ key, line }, lineNumber) => (
							<span key={key} className="block">
								<span
									className="mr-4 inline-block w-6 select-none text-right text-muted-foreground"
									aria-hidden
								>
									{lineNumber + 1}
								</span>
								{line || " "}
							</span>
						))
					: code}
			</code>
		</pre>
	);
}
