export type Question = {
	id: string
	question: string
	options: string[]
	correct: number | number[]
	multiple?: boolean
	explanation: string
	originalIndex?: number
}

export type TestState = {
	questions: Question[]
	currentQuestionIndex: number
	userAnswers: (number | number[] | null)[]
	userSelections: (number[] | null)[]
	showResults: boolean
	practiceMode: boolean
	incorrectQuestions: number[]
	startTime: Date | null
}

export type TimerState = {
	minutes: number
	seconds: number
	isRunning: boolean
}
