import { LargeTitleHeader } from "@/components/LargeTitleHeader";
import { Text } from "@/components/Text";

export default function Home() {
	return (
		<>
			<LargeTitleHeader
				title="Home"
				searchBar={{ iosHideWhenScrolling: true }}
			/>
			<Text>test</Text>
		</>
	);
}
