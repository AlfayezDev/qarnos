import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorToken, useTheme } from "@/hooks/useTheme";
import { Text } from "../ui/Text";

interface PageHeaderProps {
	title: string;
	showSearch?: boolean;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (text: string) => void;
	onSearchClear?: () => void;
	rightIcon?: string;
	onRightIconPress?: () => void;
	backgroundColor?: ColorToken;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	showSearch = false,
	searchPlaceholder = "Search...",
	searchValue = "",
	onSearchChange,
	onSearchClear,
	rightIcon,
	onRightIconPress,
	backgroundColor = "primary",
}) => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		header: {
			backgroundColor: theme.colors[backgroundColor],
			paddingTop: theme.platform.topInset,
			paddingBottom: showSearch ? theme.spacing.lg : theme.spacing.md,
			paddingHorizontal: theme.spacing.md,
		},
		titleRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: showSearch ? theme.spacing.md : 0,
		},
		title: {
			color: "white",
			fontSize: theme.typography.sizes.xl,
			fontWeight: theme.typography.weights.bold,
		},
		searchContainer: {
			backgroundColor: "rgba(255,255,255,0.15)",
			borderRadius: theme.radius.md,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: theme.spacing.md,
			height: theme.sizes.inputHeight,
		},
		searchInput: {
			flex: 1,
			fontSize: theme.typography.sizes.md,
			color: "#FFFFFF",
			height: theme.sizes.inputHeight,
		},
		iconButton: {
			padding: theme.spacing.xs,
			height: theme.sizes.touchTarget,
			width: theme.sizes.touchTarget,
			alignItems: "center",
			justifyContent: "center",
		},
	});

	return (
		<View style={styles.header}>
			<View style={styles.titleRow}>
				<Text style={styles.title}>{title}</Text>

				{rightIcon && (
					<TouchableOpacity
						style={styles.iconButton}
						onPress={onRightIconPress}
						hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
					>
						<Ionicons
							name={rightIcon as any}
							size={theme.sizes.iconMd}
							color="white"
						/>
					</TouchableOpacity>
				)}
			</View>

			{showSearch && (
				<View style={styles.searchContainer}>
					<Ionicons
						name="search"
						size={theme.sizes.iconMd}
						color="rgba(255,255,255,0.9)"
						style={{ marginRight: theme.spacing.sm }}
					/>

					<TextInput
						placeholder={searchPlaceholder}
						placeholderTextColor="rgba(255,255,255,0.7)"
						style={styles.searchInput}
						value={searchValue}
						onChangeText={onSearchChange}
					/>

					{searchValue && onSearchClear && (
						<TouchableOpacity onPress={onSearchClear} style={styles.iconButton}>
							<Ionicons
								name="close-circle"
								size={theme.sizes.iconMd}
								color="rgba(255,255,255,0.9)"
							/>
						</TouchableOpacity>
					)}
				</View>
			)}
		</View>
	);
};
