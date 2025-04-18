import { AnimatedBox, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import React, { memo } from "react";
import { EdgeInsets } from "react-native-safe-area-context";

interface DashboardHeaderProps {
	theme: AppTheme;
	insets: EdgeInsets;
	animatedStyle: any;
	currentDateString: string;
	onSettingsPress: () => void;
	headerHeight: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = memo(
	({
		theme,
		insets,
		animatedStyle,
		currentDateString,
		onSettingsPress,
		headerHeight,
	}) => {
		return (
			<AnimatedBox
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={[
					{
						height: theme.sizes.headerHeight,
					},
					animatedStyle,
				]}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{currentDateString}
				</Text>
			</AnimatedBox>
		);
	},
);
