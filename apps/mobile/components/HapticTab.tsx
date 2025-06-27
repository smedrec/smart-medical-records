import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'
import * as Haptics from 'expo-haptics'

export function HapticTab(props: BottomTabBarButtonProps) {
	const { children, onPressIn, ...rest } = props
	return (
		<PlatformPressable
			{...rest}
			onPressIn={(ev) => {
				if (process.env.EXPO_OS === 'ios') {
					// Add a soft haptic feedback when pressing down on the tabs.
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
				}
				onPressIn?.(ev)
			}}
		>
			{children}
		</PlatformPressable>
	)
}
