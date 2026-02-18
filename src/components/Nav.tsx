import { Header, HeaderProps } from "@/components/ui/header-with-search";
import { cn } from '@/lib/utils';

export default function Nav({ links }: HeaderProps) {
	return (
		<Header links={links} />
	);
}
