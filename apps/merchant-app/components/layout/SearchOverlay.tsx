import React, { useRef, useEffect, useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Keyboard,
	FlatList,
	StatusBar,
	Platform,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "../ui";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	Easing,
	interpolate,
} from "react-native-reanimated";
interface SearchResult {
	id: string | number;
	title: string;
	subtitle?: string;
	icon?: string;
}
interface SearchOverlayProps {
	isVisible: boolean;
	onClose: () => void;
	placeholder?: string;
	onSearch: (query: string) => void;
	results?: SearchResult[];
	onResultPress?: (item: SearchResult) => void;
	recentSearches?: string[];
	onClearRecents?: () => void;
}
export const SearchOverlay: React.FC<SearchOverlayProps> = ({
	isVisible,
	onClose,
	placeholder = "Search...",
	onSearch,
	results = [],
	onResultPress,
	recentSearches = [],
	onClearRecents,
}) => {
	const theme = useTheme();
	const [searchValue, setSearchValue] = useState("");
	const searchInputRef = useRef<TextInput>(null);
	const translateY = useSharedValue(0);
	const opacity = useSharedValue(0);
	useEffect(() => {
		if (isVisible) {
			setSearchValue("");
			opacity.value = withTiming(1, { duration: 200 });
			translateY.value = withSpring(1, {
				damping: 11,
				stiffness: 65,
				overshootClamping: true,
			});
			const timeoutId = setTimeout(() => {
				searchInputRef.current?.focus();
			}, 300);
			return () => clearTimeout(timeoutId);
		}
		opacity.value = withTiming(0, { duration: 150 });
		translateY.value = withTiming(0, {
			duration: 200,
			easing: Easing.ease,
		});
		Keyboard.dismiss();
	}, [isVisible, opacity, translateY]);
	const handleChangeText = (text: string) => {
		setSearchValue(text);
		onSearch(text);
	};
	const handleItemPress = (item: SearchResult) => {
		onResultPress?.(item);
		onClose();
	};
	const handleRecentPress = (query: string) => {
		setSearchValue(query);
		onSearch(query);
		searchInputRef.current?.focus(); // Keep focus after selecting recent
	};
	const containerStyle = useAnimatedStyle(() => {
		const translateYValue = interpolate(translateY.value, [0, 1], [-50, 0]);
		return {
			opacity: opacity.value,
			transform: [{ translateY: translateYValue }],
		};
	});
	const styles = StyleSheet.create({
		container: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 1000,
			backgroundColor: theme.colors.background,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			paddingTop: theme.platform.topInset,
			paddingHorizontal: theme.spacing.md,
			paddingBottom: theme.spacing.sm,
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: theme.colors.divider,
		},
		backButton: {
			padding: theme.spacing.sm,
			marginRight: theme.spacing.xs,
			borderRadius: theme.radius.round,
		},
		searchBar: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			height: theme.sizes.buttonMd,
			borderRadius: theme.radius.md,
			paddingHorizontal: theme.spacing.sm,
			backgroundColor: theme.colors.backgroundAlt,
		},
		searchIcon: {
			marginRight: theme.spacing.sm,
		},
		input: {
			flex: 1,
			height: "100%",
			fontSize: theme.typography.sizes.md,
			color: theme.colors.text,
			paddingLeft: theme.spacing.xs,
		},
		clearButton: {
			padding: theme.spacing.xs,
		},
		list: {
			paddingBottom: theme.spacing.lg,
		},
		resultItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: theme.spacing.md,
			paddingHorizontal: theme.spacing.md,
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: theme.colors.divider,
		},
		resultItemPressed: {
			backgroundColor: theme.colors.backgroundAlt,
		},
		resultIconContainer: {
			width: theme.sizes.avatarSm,
			height: theme.sizes.avatarSm,
			borderRadius: theme.radius.round,
			alignItems: "center",
			justifyContent: "center",
			marginRight: theme.spacing.md,
			backgroundColor: theme.colors.primaryLight,
		},
		resultTextContainer: {
			flex: 1,
		},
		emptyContainer: {
			flex: 1,
			padding: theme.spacing.md,
		},
		noResults: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			paddingBottom: theme.spacing.xl, // Push up slightly
		},
		noResultsIcon: {
			marginBottom: theme.spacing.md,
		},
		recentsContainer: {
			paddingVertical: theme.spacing.sm,
		},
		recentsHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: theme.spacing.sm,
			paddingHorizontal: theme.spacing.sm,
		},
		recentItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: theme.spacing.sm + 2, // Slightly more padding
			paddingHorizontal: theme.spacing.md,
			borderRadius: theme.radius.sm,
		},
		recentItemPressed: {
			backgroundColor: theme.colors.backgroundAlt,
		},
		recentIcon: {
			marginRight: theme.spacing.sm,
		},
	});
	if (!isVisible && opacity.value === 0) return null; // Fully unmount when hidden
	return (
		<Animated.View style={[styles.container, containerStyle]}>
			<StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
			<View style={styles.header}>
				<TouchableOpacity onPress={onClose} style={styles.backButton}>
					<Ionicons
						name="arrow-back"
						size={theme.sizes.iconMd}
						color={theme.colors.text}
					/>
				</TouchableOpacity>
				<View style={styles.searchBar}>
					<Ionicons
						name="search"
						size={theme.sizes.iconSm}
						color={theme.colors.textSecondary}
						style={styles.searchIcon}
					/>
					<TextInput
						ref={searchInputRef}
						style={styles.input}
						placeholder={placeholder}
						placeholderTextColor={theme.colors.textSecondary}
						value={searchValue}
						onChangeText={handleChangeText}
						returnKeyType="search"
						autoCapitalize="none"
						autoCorrect={false}
						clearButtonMode="while-editing"
					/>
					{searchValue.length > 0 && Platform.OS === "android" && (
						<TouchableOpacity
							onPress={() => handleChangeText("")}
							style={styles.clearButton}
						>
							<Ionicons
								name="close-circle"
								size={theme.sizes.iconSm}
								color={theme.colors.textSecondary}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			{results.length > 0 ? (
				<FlatList
					data={results}
					keyExtractor={(item) => item.id.toString()}
					keyboardShouldPersistTaps="handled"
					renderItem={({ item }) => (
						<Pressable
							style={({ pressed }) => [
								styles.resultItem,
								pressed && styles.resultItemPressed,
							]}
							onPress={() => handleItemPress(item)}
							android_ripple={{ color: theme.colors.overlay }}
						>
							{item.icon && (
								<View style={styles.resultIconContainer}>
									<Ionicons
										name={item.icon as any}
										size={theme.sizes.iconSm - 2}
										color={theme.colors.primary}
									/>
								</View>
							)}
							<View style={styles.resultTextContainer}>
								<Text variant="md">{item.title}</Text>
								{item.subtitle && (
									<Text
										variant="sm"
										color="textSecondary"
										marginTop={theme.spacing.xs / 2}
									>
										{item.subtitle}
									</Text>
								)}
							</View>
						</Pressable>
					)}
					contentContainerStyle={styles.list}
				/>
			) : (
				<View style={styles.emptyContainer}>
					{searchValue.length > 0 ? (
						<View style={styles.noResults}>
							<Ionicons
								name="search"
								size={theme.sizes.iconLg}
								color={theme.colors.textSecondary}
								style={styles.noResultsIcon}
							/>
							<Text color="textSecondary" center>
								No results found for "{searchValue}"
							</Text>
						</View>
					) : recentSearches.length > 0 ? (
						<View style={styles.recentsContainer}>
							<View style={styles.recentsHeader}>
								<Text variant="sm" weight="semibold" color="textSecondary">
									Recent Searches
								</Text>
								{onClearRecents && (
									<TouchableOpacity onPress={onClearRecents}>
										<Text variant="sm" color="primary">
											Clear
										</Text>
									</TouchableOpacity>
								)}
							</View>
							{recentSearches.map((query, index) => (
								<Pressable
									key={`recent-${index.toString()}`}
									style={({ pressed }) => [
										styles.recentItem,
										pressed && styles.recentItemPressed,
									]}
									onPress={() => handleRecentPress(query)}
									android_ripple={{ color: theme.colors.overlay }}
								>
									<Ionicons
										name="time-outline"
										size={theme.sizes.iconSm}
										color={theme.colors.textSecondary}
										style={styles.recentIcon}
									/>
									<Text variant="md">{query}</Text>
								</Pressable>
							))}
						</View>
					) : null}
				</View>
			)}
		</Animated.View>
	);
};
export default SearchOverlay;
