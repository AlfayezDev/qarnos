import React from "react";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import {
	FadeInUp,
	FadeOutDown,
	LinearTransition,
} from "react-native-reanimated";
import { useTheme } from "@/stores/themeStore";
import { Card } from "@/components/ui/Card";
interface StatItem {
	title: string;
	value: string | number;
	icon: string;
	variant?:
		| "sage"
		| "peach"
		| "lavender"
		| "coral"
		| "mint"
		| "cream"
		| "sky"
		| "rose";
}
interface StatsGridProps {
	stats: StatItem[];
}
export const StatsGrid = ({ stats }: StatsGridProps) => {
	const theme = useTheme();
	return (
		<Box row gap="sm">
			{stats.map((stat) => (
				<AnimatedBox
					key={stat.title}
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
					layout={LinearTransition.duration(300)}
					flex={1}
				>
					<Card
						variant={stat.variant}
						padding="md"
						rounded="sm"
						elevation="small"
					>
						<Box row alignCenter marginBottom="sm" gap="sm">
							<Box
								width={theme.sizes.buttonSm}
								height={theme.sizes.buttonSm}
								rounded="xs"
								bg="primaryLight"
								alignItems="center"
								justifyContent="center"
							>
								<Ionicons
									name={stat.icon as any}
									size={theme.sizes.iconSm}
									color={theme.colors.primary}
								/>
							</Box>
							<Text variant="xs" weight="medium" color="textSecondary">
								{stat.title}
							</Text>
						</Box>
						<Text variant="xl" weight="bold" fontFamily="serif" color="text">
							{stat.value}
						</Text>
					</Card>
				</AnimatedBox>
			))}
		</Box>
	);
};
