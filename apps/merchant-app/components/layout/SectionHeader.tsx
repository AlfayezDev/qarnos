import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SpacingToken, useTheme } from "@/hooks/useTheme";
import { Text } from "../ui/Text";

interface SectionHeaderProps {
	title: string;
	actionLabel?: string;
	onActionPress?: () => void;
	marginTop?: SpacingToken;
	marginBottom?: SpacingToken;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	actionLabel,
	onActionPress,
	marginTop = "sm",
	marginBottom = "sm",
}) => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginHorizontal: theme.spacing.md,
			marginTop: theme.spacing[marginTop],
			marginBottom: theme.spacing[marginBottom],
		},
		actionButton: {
			padding: theme.spacing.sm,
		},
	});

	return (
		<View style={styles.container}>
			<Text variant="lg" weight="semibold">
				{title}
			</Text>

			{actionLabel && onActionPress && (
				<TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
					<Text color="primary" weight="medium" variant="sm">
						{actionLabel}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};
