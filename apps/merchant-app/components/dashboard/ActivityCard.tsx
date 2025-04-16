import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Alert, OverviewStats } from "@/types";
import { AlertRow } from "./AlertRow";

interface ActivityCardProps {
	alerts: Alert[];
	overviewStats: OverviewStats;
	theme: AppTheme;
	onViewAlert: (id: string | number) => void;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const ActivityCard: React.FC<ActivityCardProps> = React.memo(
	({ alerts, overviewStats, theme, onViewAlert }) => {
		const hasAlerts = alerts.length > 0;
		return (
			<AnimatedBox
				entering={FadeInUp.delay(350).duration(400).springify().damping(15)}
				exiting={FadeOutDown.duration(200)}
				bg="card"
				rounded="lg"
				marginHorizontal="md"
				marginBottom="lg"
				padding="md"
				elevation="medium"
				style={localStyles.activityCard}
			>
				<Text variant="lg" weight="semibold" marginBottom="md">
					Activity & Alerts
				</Text>
				<Box row marginBottom="md">
					<Box flex={1} marginRight="sm">
						<Text
							variant="sm"
							color="textSecondary"
							marginBottom={theme.spacing.xs / 2}
						>
							Active Subs
						</Text>
						<Text variant="xl" weight="bold">
							{overviewStats.activeSubscriptions}
						</Text>
					</Box>
					<Box flex={1} marginLeft="sm">
						<Text
							variant="sm"
							color="textSecondary"
							marginBottom={theme.spacing.xs / 2}
						>
							New This Week
						</Text>
						<Text variant="xl" weight="bold" color="success">
							+{overviewStats.newThisWeek}
						</Text>
					</Box>
				</Box>
				{hasAlerts ? (
					<Box marginTop="xs">
						{alerts.map((alert, index) => (
							<Box
								key={alert.id}
								style={{
									borderTopColor: theme.colors.divider,
									borderTopWidth: index > 0 ? StyleSheet.hairlineWidth : 0,
								}}
							>
								<AlertRow
									alert={alert}
									theme={theme}
									onPress={() => onViewAlert(alert.id)}
								/>
							</Box>
						))}
					</Box>
				) : (
					<Box row alignCenter paddingVertical="sm" marginTop="xs">
						<Ionicons
							name="checkmark-circle-outline"
							size={theme.sizes.iconSm}
							color={theme.colors.success}
							style={{ marginRight: theme.spacing.sm }}
						/>
						<Text color="textSecondary" variant="sm">
							No pressing alerts.
						</Text>
					</Box>
				)}
			</AnimatedBox>
		);
	},
);

const localStyles = StyleSheet.create({
	activityCard: {},
});
