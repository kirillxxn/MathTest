import React, { useState, useEffect, useCallback } from 'react'
import type { TestState } from '../../shared/types/types'
import { testQuestions } from '../../data/testData'
import { useTimer } from '../../hooks/useTimer'
import { arraysEqual } from '../../utils/utils'
import QuestionComponent from '../QuestionComponent/QuestionComponent'
import ResultsComponent from '../ResultsComponent/ResultsComponent'
import styles from './GeometryTest.module.css'

const GeometryTest: React.FC = () => {
	const [testState, setTestState] = useState<TestState>({
		questions: testQuestions,
		currentQuestionIndex: 0,
		userAnswers: Array(testQuestions.length).fill(null),
		userSelections: Array(testQuestions.length).fill(null),
		showResults: false,
		practiceMode: false,
		incorrectQuestions: [],
		startTime: null,
	})

	const [timer, startTimer, stopTimer] = useTimer()

	const currentQuestion = testState.questions[testState.currentQuestionIndex]

	// Запуск таймера при начале теста
	useEffect(() => {
		if (!testState.showResults && !timer.isRunning) {
			startTimer()
		}
	}, [testState.showResults, timer.isRunning, startTimer])

	const handleAnswerSelect = useCallback((optionIndex: number) => {
		setTestState(prev => {
			const newUserAnswers = [...prev.userAnswers]
			const newUserSelections = [...prev.userSelections]
			const currentQuestion = prev.questions[prev.currentQuestionIndex]

			if (currentQuestion.multiple) {
				if (!newUserSelections[prev.currentQuestionIndex]) {
					newUserSelections[prev.currentQuestionIndex] = []
				}

				const currentSelections =
					newUserSelections[prev.currentQuestionIndex] || []
				const answerIndex = currentSelections.indexOf(optionIndex)

				if (answerIndex === -1) {
					newUserSelections[prev.currentQuestionIndex] = [
						...currentSelections,
						optionIndex,
					]
				} else {
					newUserSelections[prev.currentQuestionIndex] =
						currentSelections.filter(idx => idx !== optionIndex)
				}
				newUserAnswers[prev.currentQuestionIndex] =
					newUserSelections[prev.currentQuestionIndex]
			} else {
				newUserAnswers[prev.currentQuestionIndex] = optionIndex
				newUserSelections[prev.currentQuestionIndex] = [optionIndex]
			}

			return {
				...prev,
				userAnswers: newUserAnswers,
				userSelections: newUserSelections,
			}
		})
	}, [])

	const calculateResults = useCallback(() => {
		const incorrectQuestions: number[] = []

		testState.userAnswers.forEach((answer, index) => {
			const question = testState.questions[index]

			if (question.multiple) {
				if (
					!answer ||
					!arraysEqual(answer as number[], question.correct as number[])
				) {
					incorrectQuestions.push(index)
				}
			} else {
				if (answer !== question.correct) {
					incorrectQuestions.push(index)
				}
			}
		})

		stopTimer()

		setTestState(prev => ({
			...prev,
			showResults: true,
			incorrectQuestions,
		}))
	}, [testState.userAnswers, testState.questions, stopTimer])

	const goToNextQuestion = useCallback(() => {
		if (testState.currentQuestionIndex < testState.questions.length - 1) {
			setTestState(prev => ({
				...prev,
				currentQuestionIndex: prev.currentQuestionIndex + 1,
			}))
		} else {
			calculateResults()
		}
	}, [
		testState.currentQuestionIndex,
		testState.questions.length,
		calculateResults,
	])

	const goToPreviousQuestion = useCallback(() => {
		if (testState.currentQuestionIndex > 0) {
			setTestState(prev => ({
				...prev,
				currentQuestionIndex: prev.currentQuestionIndex - 1,
			}))
		}
	}, [testState.currentQuestionIndex])

	const handleRestart = useCallback(() => {
		stopTimer()
		setTestState({
			questions: testQuestions,
			currentQuestionIndex: 0,
			userAnswers: Array(testQuestions.length).fill(null),
			userSelections: Array(testQuestions.length).fill(null),
			showResults: false,
			practiceMode: false,
			incorrectQuestions: [],
			startTime: null,
		})
	}, [stopTimer])

	const handlePracticeMode = useCallback(() => {
		if (testState.incorrectQuestions.length === 0) {
			alert('Поздравляем! У вас нет ошибок для тренировки! 🎉')
			return
		}

		const practiceQuestions = testState.incorrectQuestions.map(index => ({
			...testState.questions[index],
			originalIndex: index,
		}))

		setTestState({
			questions: practiceQuestions,
			currentQuestionIndex: 0,
			userAnswers: Array(practiceQuestions.length).fill(null),
			userSelections: Array(practiceQuestions.length).fill(null),
			showResults: false,
			practiceMode: true,
			incorrectQuestions: [],
			startTime: null,
		})
	}, [testState.incorrectQuestions, testState.questions])

	const isNextButtonDisabled = useCallback((): boolean => {
		if (testState.practiceMode) return false

		const currentAnswer = testState.userAnswers[testState.currentQuestionIndex]
		const hasAnswer = currentAnswer !== null && currentAnswer !== undefined
		const hasMultipleAnswers =
			Array.isArray(currentAnswer) && currentAnswer.length > 0

		return !(hasAnswer && (hasMultipleAnswers || !currentQuestion.multiple))
	}, [
		testState.practiceMode,
		testState.userAnswers,
		testState.currentQuestionIndex,
		currentQuestion.multiple,
	])

	const getQuestionInfo = (): string => {
		const currentAnswer = testState.userAnswers[testState.currentQuestionIndex]
		if (currentAnswer !== null && currentAnswer !== undefined) {
			if (Array.isArray(currentAnswer)) {
				return `Выбрано: ${currentAnswer.length} вариант(ов)`
			} else {
				return `Ответ: ${(currentAnswer as number) + 1}`
			}
		}
		return 'Ответ не выбран'
	}

	const progress =
		((testState.currentQuestionIndex + 1) / testState.questions.length) * 100
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (testState.showResults) return

			if (e.key >= '1' && e.key <= '9') {
				const optionIndex = parseInt(e.key) - 1
				if (optionIndex < currentQuestion.options.length) {
					handleAnswerSelect(optionIndex)
				}
			} else if (e.key === 'ArrowLeft' && testState.currentQuestionIndex > 0) {
				goToPreviousQuestion()
			} else if (
				e.key === 'ArrowRight' &&
				testState.currentQuestionIndex < testState.questions.length - 1
			) {
				if (!isNextButtonDisabled()) {
					goToNextQuestion()
				}
			} else if (e.key === 'Enter' && !isNextButtonDisabled()) {
				if (testState.currentQuestionIndex === testState.questions.length - 1) {
					calculateResults()
				} else {
					goToNextQuestion()
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [
		testState.currentQuestionIndex,
		testState.questions.length,
		testState.showResults,
		currentQuestion.options.length,
		handleAnswerSelect,
		goToPreviousQuestion,
		goToNextQuestion,
		calculateResults,
		isNextButtonDisabled,
	])

	if (testState.showResults) {
		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<h1>Тест по геометрии</h1>
				</div>
				<div className={styles.content}>
					<ResultsComponent
						questions={testState.questions}
						incorrectQuestions={testState.incorrectQuestions}
						timer={timer}
						onRestart={handleRestart}
						onPracticeMode={handlePracticeMode}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Тест по геометрии</h1>
				<div className={styles.progress}>
					Вопрос {testState.currentQuestionIndex + 1} из{' '}
					{testState.questions.length}
				</div>
				<div className={styles.questionCounter}>
					ID вопроса: {currentQuestion.id}
				</div>
				<div className={styles.progressBar}>
					<div
						className={styles.progressFill}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<div className={styles.timer}>
					{timer.minutes.toString().padStart(2, '0')}:
					{timer.seconds.toString().padStart(2, '0')}
				</div>
			</div>

			<div className={styles.content}>
				<QuestionComponent
					question={currentQuestion}
					userAnswer={testState.userAnswers[testState.currentQuestionIndex]}
					userSelections={
						testState.userSelections[testState.currentQuestionIndex]
					}
					onAnswerSelect={handleAnswerSelect}
				/>

				<div className={styles.buttons}>
					<button
						className={styles.button}
						onClick={goToPreviousQuestion}
						disabled={testState.currentQuestionIndex === 0}
					>
						← Назад
					</button>

					<div className={styles.questionInfo}>{getQuestionInfo()}</div>

					<button
						className={styles.button}
						onClick={goToNextQuestion}
						disabled={isNextButtonDisabled()}
					>
						{testState.currentQuestionIndex === testState.questions.length - 1
							? 'Завершить'
							: 'Далее →'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default GeometryTest
