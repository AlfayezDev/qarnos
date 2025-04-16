import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	LinearTransition,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";

interface StatItem {
	title: string;
	value: string | number;
	icon: string;
}
interface StatsGridProps {
	stats: StatItem[];
	theme: AppTheme;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const StatsGrid: React.FC<StatsGridProps> = React.memo(
	({ stats, theme }) => {
		return (
			<AnimatedBox
				layout={LinearTransition.delay(100).duration(300)}
				row
				marginHorizontal="md"
				marginBottom="lg"
			>
				{stats.map((stat, index) => (
					<AnimatedBox
						key={stat.title}
						entering={FadeInUp.duration(300)}
						exiting={FadeOutDown.duration(200)}
						layout={LinearTransition.duration(300)}
						flex={1}
						marginRight={index < stats.length - 1 ? "sm" : undefined}
					>
						<Box
							bg="card"
							padding="md"
							rounded="lg"
							elevation="small"
							style={localStyles.statCard}
						>
							<Box row alignCenter marginBottom="sm">
								<Box
									style={[
										localStyles.statIconContainer,
										{ borderRadius: theme.radius.sm },
									]}
									bg="primaryLight"
									marginRight="sm"
								>
									<Ionicons
										name={stat.icon as any}
										size={theme.sizes.iconSm}
										color={theme.colors.primary}
									/>
								</Box>
								<Text variant="sm" color="textSecondary">
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

const localStyles = StyleSheet.create({
	statCard: {},
	statIconContainer: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
});
