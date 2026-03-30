declare module "*.css";

declare module "lucide-react/dist/esm/icons/*.js" {
	export const __iconNode: ReadonlyArray<
		readonly [string, Record<string, string | undefined>]
	>;
}
