import React from "react";
import { AnimatedBox, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

interface DashboardHeaderProps {
	currentDateString: string;
	animatedStyle: any;
}

export const DashboardHeader = React.memo(
	({ currentDateString, animatedStyle }: DashboardHeaderProps) => {
		const theme = useTheme();

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
