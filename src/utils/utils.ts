export const arraysEqual = (a: number[], b: number[]): boolean => {
	if (a === b) return true
	if (a == null || b == null) return false
	if (a.length !== b.length) return false

	const sortedA = [...a].sort()
	const sortedB = [...b].sort()

	for (let i = 0; i < sortedA.length; i++) {
		if (sortedA[i] !== sortedB[i]) return false
	}
	return true
}

export const formatTime = (minutes: number, seconds: number): string => {
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
}

export const calculateSuccessRate = (
	correct: number,
	total: number
): string => {
	return `${Math.round((correct / total) * 100)}%`
}
