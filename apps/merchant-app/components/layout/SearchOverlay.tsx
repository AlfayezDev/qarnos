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
} from "react-native-reanimated";

function interpolate(
	value: number,
	inputRange: number[],
	outputRange: number[],
) {
	"worklet";

	if (value <= inputRange[0]) {
		return outputRange[0];
	}
	if (value >= inputRange[1]) {
		return outputRange[1];
	}
	return (
		outputRange[0] +
		((value - inputRange[0]) * (outputRange[1] - outputRange[0])) /
			(inputRange[1] - inputRange[0])
	);
}
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

	// Animation values
	const translateY = useSharedValue(0);
	const opacity = useSharedValue(0);

	// Show/hide the overlay
	useEffect(() => {
		if (isVisible) {
			// Reset search on open
			setSearchValue("");

			// Start animations
			opacity.value = withTiming(1, { duration: 200 });
			translateY.value = withSpring(1, {
				damping: 11,
				stiffness: 65,
			});

			// Focus the input
			const timeoutId = setTimeout(() => {
				if (searchInputRef.current) {
					searchInputRef.current.focus();
				}
			}, 300);

			return () => clearTimeout(timeoutId);
		}
		// Hide animations
		opacity.value = withTiming(0, { duration: 150 });
		translateY.value = withTiming(0, {
			duration: 200,
			easing: Easing.ease,
		});

		// Dismiss keyboard
		Keyboard.dismiss();
	}, [isVisible]);

	// Handle search
	const handleChangeText = (text: string) => {
		setSearchValue(text);
		onSearch(text);
	};

	// Handle result selection
	const handleItemPress = (item: SearchResult) => {
		onResultPress?.(item);
		onClose();
	};

	// Handle recent search press
	const handleRecentPress = (query: string) => {
		setSearchValue(query);
		onSearch(query);
	};

	// Create animation styles
	const containerStyle = useAnimatedStyle(() => {
		const translateYValue = interpolate(translateY.value, [0, 1], [-50, 0]);

		return {
			opacity: opacity.value,
			transform: [{ translateY: translateYValue }],
		};
	});

	// If completely hidden, don't render
	if (!isVisible) return null;

	return (
		<Animated.View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
				containerStyle,
			]}
		>
			<StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />

			{/* Search Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={onClose} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={theme.colors.text} />
				</TouchableOpacity>

				<View
					style={[styles.searchBar, { backgroundColor: theme.colors.cardAlt }]}
				>
					<Ionicons
						name="search"
						size={20}
						color={theme.colors.textSecondary}
						style={{ marginRight: 8 }}
					/>

					<TextInput
						ref={searchInputRef}
						style={[styles.input, { color: theme.colors.text }]}
						placeholder={placeholder}
						placeholderTextColor={theme.colors.textSecondary}
						value={searchValue}
						onChangeText={handleChangeText}
						returnKeyType="search"
						autoCapitalize="none"
					/>

					{searchValue.length > 0 && (
						<TouchableOpacity onPress={() => handleChangeText("")}>
							<Ionicons
								name="close-circle"
								size={20}
								color={theme.colors.textSecondary}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Results */}
			{results.length > 0 ? (
				<FlatList
					data={results}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Pressable
							style={({ pressed }) => [
								styles.resultItem,
								pressed && { backgroundColor: theme.colors.cardAlt },
							]}
							onPress={() => handleItemPress(item)}
							android_ripple={{ color: theme.colors.cardAlt }}
						>
							{item.icon && (
								<View
									style={[
										styles.resultIcon,
										{ backgroundColor: theme.colors.primaryLight },
									]}
								>
									<Ionicons
										name={item.icon as any}
										size={18}
										color={theme.colors.primary}
									/>
								</View>
							)}

							<View style={styles.resultText}>
								<Text style={{ fontSize: 16, color: theme.colors.text }}>
									{item.title}
								</Text>
								{item.subtitle && (
									<Text
										style={{
											fontSize: 14,
											color: theme.colors.textSecondary,
											marginTop: 2,
										}}
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
				// Recent searches or empty state
				<View style={styles.emptyContainer}>
					{searchValue.length > 0 ? (
						<View style={styles.noResults}>
							<Ionicons
								name="search"
								size={32}
								color={theme.colors.textSecondary}
								style={{ marginBottom: 16 }}
							/>
							<Text style={{ color: theme.colors.textSecondary }}>
								No results found for "{searchValue}"
							</Text>
						</View>
					) : recentSearches.length > 0 ? (
						<View style={styles.recentsContainer}>
							<View style={styles.recentsHeader}>
								<Text
									style={{
										fontSize: 14,
										color: theme.colors.textSecondary,
										fontWeight: "600",
									}}
								>
									Recent Searches
								</Text>

								<TouchableOpacity onPress={onClearRecents}>
									<Text style={{ fontSize: 14, color: theme.colors.primary }}>
										Clear
									</Text>
								</TouchableOpacity>
							</View>

							{recentSearches.map((query, index) => (
								<Pressable
									key={`recent-searches-${index.toString()}`}
									style={({ pressed }) => [
										styles.recentItem,
										pressed && { backgroundColor: theme.colors.cardAlt },
									]}
									onPress={() => handleRecentPress(query)}
									android_ripple={{ color: theme.colors.cardAlt }}
								>
									<Ionicons
										name="time-outline"
										size={18}
										color={theme.colors.textSecondary}
										style={{ marginRight: 8 }}
									/>
									<Text style={{ fontSize: 15, color: theme.colors.text }}>
										{query}
									</Text>
								</Pressable>
							))}
						</View>
					) : null}
				</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1000,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: Platform.OS === "ios" ? 60 : 16,
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	backButton: {
		padding: 8,
		marginRight: 8,
		borderRadius: 20,
	},
	searchBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		height: 44,
		borderRadius: 10,
		paddingHorizontal: 12,
	},
	input: {
		flex: 1,
		height: "100%",
		fontSize: 16,
		marginLeft: 4,
	},
	list: {
		paddingBottom: 20,
	},
	resultItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "rgba(0,0,0,0.1)",
	},
	resultIcon: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	resultText: {
		flex: 1,
	},
	emptyContainer: {
		flex: 1,
		padding: 16,
	},
	noResults: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	recentsContainer: {
		paddingVertical: 8,
	},
	recentsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
		paddingHorizontal: 8,
	},
	recentItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
});

export default SearchOverlay;
