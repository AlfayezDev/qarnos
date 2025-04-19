import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Log to error reporting service
		console.error("Error caught by ErrorBoundary:", error, errorInfo);
	}

	resetError = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<ErrorFallback error={this.state.error} resetError={this.resetError} />
			);
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error?: Error;
	resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
	const theme = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<Text variant="lg" weight="semibold" color="error" marginBottom="md">
				Something went wrong
			</Text>
			<Text variant="md" color="textSecondary" marginBottom="lg">
				{error?.message || "An unexpected error occurred"}
			</Text>
			<Button
				title="Try Again"
				onPress={resetError}
				accessibilityLabel="Try again button"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
});
