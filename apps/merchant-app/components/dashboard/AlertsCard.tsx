import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";

interface AlertsCardProps {
	alerts: Alert[];
	theme: AppTheme;
	onViewAlert: (id: string | number) => void;
	onViewAllAlerts?: () => void;
}

export const AlertsCard: React.FC<AlertsCardProps> = React.memo(
	({ alerts, theme, onViewAlert, onViewAllAlerts }) => {
		const hasAlerts = alerts.length > 0;

		return (
			<AnimatedBox
				entering={FadeInUp.delay(350).duration(400).springify().damping(15)}
				exiting={FadeOutDown.duration(200)}
				bg="card"
				rounded="lg"
				marginHorizontal="md"
				marginBottom="lg"
				elevation="small"
				style={{ overflow: "hidden" }}
			>
				<Box
					row
					justifyContent="space-between"
					alignItems="center"
					marginBottom="md"
					paddingHorizontal="md"
					paddingTop="md"
				>
					<Text variant="lg" weight="semibold">
						Alerts
					</Text>
					{hasAlerts && (
						<Animated.View>
							<Pressable
								onPress={onViewAllAlerts}
								style={({ pressed }) => [
									{
										paddingVertical: theme.spacing.xs,
										paddingHorizontal: theme.spacing.sm,
										borderRadius: theme.radius.sm,
										backgroundColor: pressed
											? theme.colors.primaryLight
											: undefined,
										transform: [{ scale: pressed ? 0.96 : 1 }],
									},
								]}
							>
								<Text variant="sm" color="primary" weight="medium">
									View all
								</Text>
							</Pressable>
						</Animated.View>
					)}
				</Box>

				{hasAlerts ? (
					<Box>
						{alerts.map((alert, index) => (
							<AlertItem
								key={alert.id}
								alert={alert}
								theme={theme}
								onPress={() => onViewAlert(alert.id)}
								isLast={index === alerts.length - 1}
							/>
						))}
					</Box>
				) : (
					<Box
						alignCenter
						paddingVertical="lg"
						paddingHorizontal="md"
						bg="backgroundAlt"
						style={{
							borderBottomLeftRadius: theme.radius.lg,
							borderBottomRightRadius: theme.radius.lg,
						}}
					>
						<Box
							rounded="round"
							bg="primaryLight"
							padding="md"
							marginBottom="md"
							style={{
								width: theme.sizes.avatarLg,
								height: theme.sizes.avatarLg,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons
								name="checkmark-circle"
								size={theme.sizes.iconMd}
								color={theme.colors.primary}
							/>
						</Box>
						<Text color="textSecondary" center>
							You're all caught up!
						</Text>
						<Text color="textMuted" variant="sm" center marginTop="xs">
							No pressing alerts at the moment
						</Text>
					</Box>
				)}
			</AnimatedBox>
		);
	},
);

interface AlertItemProps {
	alert: Alert;
	theme: AppTheme;
	onPress: () => void;
	isLast?: boolean;
}

const AlertItem: React.FC<AlertItemProps> = React.memo(
	({ alert, theme, onPress, isLast = false }) => {
		const iconColor = theme.colors[alert.type];
		const pressed = useSharedValue(0);

		const handlePressIn = () => {
			pressed.value = withTiming(1, { duration: 100 });
		};

		const handlePressOut = () => {
			pressed.value = withTiming(0, { duration: 200 });
		};

		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{
						scale: withTiming(pressed.value === 1 ? 0.98 : 1, {
							duration: pressed.value === 1 ? 100 : 200,
						}),
					},
				],
				backgroundColor:
					pressed.value === 1 ? theme.colors.backgroundAlt : "transparent",
			};
		});

		return (
			<Animated.View
				style={[
					{
						borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
						borderBottomColor: theme.colors.divider,
					},
					animatedStyle,
				]}
			>
				<Pressable
					onPress={onPress}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					style={{
						flexDirection: "row",
						alignItems: "center",
						padding: theme.spacing.md,
					}}
					android_ripple={{ color: theme.colors.overlay }}
				>
					<View
						style={{
							width: theme.sizes.buttonSm,
							height: theme.sizes.buttonSm,
							borderRadius: theme.radius.round,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: theme.colors.primaryLight,
						}}
					>
						<Ionicons
							name={alert.icon as any}
							size={theme.sizes.iconSm}
							color={iconColor}
						/>
					</View>

					<Box flex={1} marginLeft="sm">
						<Text variant="sm" weight="medium" numberOfLines={1}>
							{alert.title}
						</Text>
						{alert.timestamp && (
							<Text
								variant="xs"
								color="textMuted"
								marginTop={theme.spacing.xs / 2}
							>
								{alert.timestamp}
							</Text>
						)}
					</Box>

					<Box
						marginLeft="sm"
						paddingVertical="xs"
						paddingHorizontal="sm"
						rounded="xs"
						bg="backgroundAlt"
					>
						<Text
							variant="xs"
							weight="medium"
							color={alert.type}
							numberOfLines={1}
						>
							{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
						</Text>
					</Box>
				</Pressable>
			</Animated.View>
		);
	},
);
