import { Header, HeaderProps } from "@/components/ui/header-with-search";

export default function Nav({ links }: HeaderProps) {
	return (
		<Header links={links} />
	);
}
