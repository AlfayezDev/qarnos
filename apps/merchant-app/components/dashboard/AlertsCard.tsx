import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface AlertsCardProps {
	alerts: Alert[];
	onViewAlert: (id: string | number) => void;
	onViewAllAlerts?: () => void;
}

export const AlertsCard = React.memo(
	({ alerts, onViewAlert, onViewAllAlerts }: AlertsCardProps) => {
		const theme = useTheme();
		const { t } = useTranslation();
		const hasAlerts = alerts.length > 0;

		return (
			<AnimatedBox
				entering={FadeInUp.delay(350).duration(400).springify().damping(15)}
				exiting={FadeOutDown.duration(200)}
				card
				rounded="sm"
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
						{t("dashboard.alerts")}
					</Text>
					{hasAlerts && (
						<Animated.View>
							<Pressable
								onPress={onViewAllAlerts}
								style={({ pressed }) => ({
									paddingVertical: theme.spacing.xs,
									paddingHorizontal: theme.spacing.sm,
									borderRadius: theme.spacing.sm,
									backgroundColor: pressed
										? theme.colors.backgroundAlt
										: undefined,
									opacity: pressed ? 0.5 : 1,
								})}
							>
								<Text variant="sm" color="primary" weight="medium">
									{t("dashboard.viewAll")}
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
							{t("dashboard.allCaughtUp")}
						</Text>
						<Text color="textMuted" variant="sm" center marginTop="xs">
							{t("dashboard.noAlerts")}
						</Text>
					</Box>
				)}
			</AnimatedBox>
		);
	},
);

interface AlertItemProps {
	alert: Alert;
	onPress: () => void;
	isLast?: boolean;
}

const AlertItem = React.memo(
	({ alert, onPress, isLast = false }: AlertItemProps) => {
		const theme = useTheme();
		const { isRTL } = useTranslation();
		const pressed = useSharedValue(0);
		const iconColor = theme.colors[alert.type];

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
							duration: pressed.value === 1 ? 50 : 200,
						}),
					},
				],
				opacity: withTiming(pressed.value === 1 ? 0.5 : 1, {
					duration: pressed.value === 1 ? 50 : 200,
				}),
			};
		});

		return (
			<Animated.View
				style={[
					{
						borderBottomWidth: isLast ? 0 : 0.5,
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
							marginStart: theme.spacing.sm,
						}}
					>
						<Ionicons
							name={alert.icon as any}
							size={theme.sizes.iconSm}
							color={iconColor}
						/>
					</View>
					<Box
						flex={1}
						marginStart="sm"
						gap={theme.spacing.xs / 2}
						alignItems="flex-start"
					>
						<Text variant="sm" weight="medium" numberOfLines={1}>
							{alert.title}
						</Text>
						{alert.timestamp && (
							<Text variant="xs" color="textMuted">
								{alert.timestamp}
							</Text>
						)}
					</Box>
					<Box
						marginStart="sm"
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
					<Ionicons
						name={isRTL ? "chevron-back" : "chevron-forward"}
						size={theme.sizes.iconSm}
						color={theme.colors.textMuted}
						style={{ marginStart: theme.spacing.sm }}
					/>
				</Pressable>
			</Animated.View>
		);
	},
);
