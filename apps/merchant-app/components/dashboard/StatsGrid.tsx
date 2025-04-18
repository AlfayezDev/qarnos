import { AnimatedBox, Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	FadeInUp,
	FadeOutDown,
	LinearTransition,
} from "react-native-reanimated";

interface StatItem {
	title: string;
	value: string | number;
	icon: string;
}

interface StatsGridProps {
	stats: StatItem[];
	theme: AppTheme;
}

export const StatsGrid: React.FC<StatsGridProps> = React.memo(
	({ stats, theme }) => {
		return (
			<AnimatedBox
				layout={LinearTransition.delay(100).duration(300)}
				row
				marginHorizontal="sm"
				marginBottom="lg"
				gap={"sm"}
			>
				{stats.map((stat) => (
					<AnimatedBox
						key={stat.title}
						entering={FadeInUp.duration(300)}
						exiting={FadeOutDown.duration(200)}
						layout={LinearTransition.duration(300)}
						flex={1}
					>
						<Box bg="card" padding="md" rounded="lg" elevation="small">
							<Box row alignCenter marginBottom="sm" gap={"sm"}>
								<Box
									width={theme.sizes.buttonSm}
									height={theme.sizes.buttonSm}
									alignItems="center"
									justifyContent="center"
									rounded={"sm"}
									bg="primaryLight"
								>
									<Ionicons
										name={stat.icon as any}
										size={theme.sizes.iconSm}
										color={theme.colors.primary}
									/>
								</Box>
								<Text variant="xs" weight="semibold" color="textSecondary">
									{stat.title}
								</Text>
							</Box>
							<Text variant="xl" weight="bold">
								{stat.value}
							</Text>
						</Box>
					</AnimatedBox>
				))}
			</AnimatedBox>
		);
	},
);
