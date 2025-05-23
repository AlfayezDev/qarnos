import React from "react";
import { Pressable } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { useTheme } from "@/stores/themeStore";
import { Alert } from "@/types";
import { useTranslation } from "@/stores/translationStore";

interface AlertsCardProps {
	alerts: Alert[];
	onViewAlert: (id: string | number) => void;
	onViewAllAlerts?: () => void;
}

export const AlertsCard = ({
	alerts,
	onViewAlert,
	onViewAllAlerts,
}: AlertsCardProps) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const hasAlerts = alerts.length > 0;

	return (
		<AnimatedBox
			entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
				.duration(theme.animations.duration.extraSlow)
				.springify()
				.damping(theme.animations.spring.damping.light)}
			exiting={FadeOutDown.duration(theme.animations.duration.medium)}
			marginHorizontal="md"
			style={{ overflow: "hidden" }}
		>
			<Box rounded="lg" elevation="small">
				<Box row justifyContent="space-between" alignItems="center">
					<Text variant="lg" weight="semibold" fontFamily="serif">
						{t("dashboard.alerts")}
					</Text>
					{hasAlerts && (
						<Animated.View>
							<Pressable
								onPress={onViewAllAlerts}
								style={({ pressed }) => ({
									backgroundColor: "transparent",
									opacity: pressed ? 0.7 : 1,
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
					<Box alignCenter paddingVertical="lg" bg="backgroundAlt">
						<Box
							rounded="round"
							bg="accentMint"
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
								color={theme.colors.text}
							/>
						</Box>
						<Text color="textSecondary" center fontFamily="serif">
							{t("dashboard.allCaughtUp")}
						</Text>
						<Text color="textMuted" variant="sm" center marginTop="xs">
							{t("dashboard.noAlerts")}
						</Text>
					</Box>
				)}
			</Box>
		</AnimatedBox>
	);
};

interface AlertItemProps {
	alert: Alert;
	onPress: () => void;
	isLast?: boolean;
}

const AlertItem = ({ alert, onPress, isLast = false }: AlertItemProps) => {
	const theme = useTheme();
	const { isRTL } = useTranslation();
	const pressed = useSharedValue(0);

	const handlePressIn = () => {
		pressed.value = withTiming(1, {
			duration: theme.animations.duration.medium,
		});
	};

	const handlePressOut = () => {
		pressed.value = withTiming(0, {
			duration: theme.animations.duration.medium,
		});
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: withTiming(
						pressed.value === 1 ? theme.animations.scale.pressed : 1,
						{
							duration:
								pressed.value === 1
									? theme.animations.duration.fast / 2
									: theme.animations.duration.medium,
						},
					),
				},
			],
			opacity: withTiming(
				pressed.value === 1 ? theme.animations.scale.pressedSmall : 1,
				{
					duration:
						pressed.value === 1
							? theme.animations.duration.fast / 2
							: theme.animations.duration.medium,
				},
			),
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
					paddingVertical: theme.spacing.md,
					paddingHorizontal: theme.spacing.xs,
				}}
				android_ripple={{
					color: theme.colors.overlay,
				}}
			>
				<Box
					width={32}
					height={32}
					rounded="xs"
					alignItems="center"
					bg="primaryLight"
					justifyContent="center"
				>
					<Ionicons
						name={alert.icon as any}
						size={theme.sizes.iconSm}
						color={theme.colors.text}
					/>
				</Box>
				<Box
					flex={1}
					marginStart="sm"
					gap={theme.spacing.xs / 2}
					alignItems="flex-start"
				>
					<Text variant="sm" weight="medium" numberOfLines={1}>
						{isRTL ? alert.title_ar : alert.title}
					</Text>
					{alert.timestamp && (
						<Text variant="xs" color="textMuted">
							{alert.timestamp}
						</Text>
					)}
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
};
