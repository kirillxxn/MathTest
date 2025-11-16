import { useState, useEffect, useRef } from 'react'
import type { TimerState } from '../shared/types/types'

export const useTimer = (): [TimerState, () => void, () => void] => {
	const [timer, setTimer] = useState<TimerState>({
		minutes: 0,
		seconds: 0,
		isRunning: false,
	})

	const intervalRef = useRef<number | null>(null)

	const startTimer = () => {
		if (!timer.isRunning) {
			setTimer(prev => ({ ...prev, isRunning: true }))
		}
	}

	const stopTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}
		setTimer(prev => ({ ...prev, isRunning: false }))
	}

	useEffect(() => {
		if (timer.isRunning) {
			intervalRef.current = window.setInterval(() => {
				setTimer(prev => {
					const totalSeconds = prev.minutes * 60 + prev.seconds + 1
					return {
						minutes: Math.floor(totalSeconds / 60),
						seconds: totalSeconds % 60,
						isRunning: true,
					}
				})
			}, 1000)
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [timer.isRunning])

	return [timer, startTimer, stopTimer]
}
