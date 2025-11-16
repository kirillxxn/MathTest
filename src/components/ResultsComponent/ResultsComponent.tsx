import React from 'react'
import type { Question } from '../../shared/types/types'
import { formatTime, calculateSuccessRate } from '../../utils/utils'
import styles from '..//GeometryTest/GeometryTest.module.css'

type ResultsComponentProps = {
	questions: Question[]
	incorrectQuestions: number[]
	timer: { minutes: number; seconds: number }
	onRestart: () => void
	onPracticeMode: () => void
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
	questions,
	incorrectQuestions,
	timer,
	onRestart,
	onPracticeMode,
}) => {
	const correctAnswers = questions.length - incorrectQuestions.length
	const successRate = calculateSuccessRate(correctAnswers, questions.length)

	const getMessage = (): string => {
		if (correctAnswers === questions.length) {
			return 'Поздравляем! Идеальный результат! 🎉'
		} else if (correctAnswers >= questions.length * 0.8) {
			return 'Отличный результат! Почти идеально! 👍'
		} else if (correctAnswers >= questions.length * 0.6) {
			return 'Хороший результат! Есть куда стремиться! 💪'
		} else {
			return 'Есть над чем поработать. Попробуйте режим тренировки! 📚'
		}
	}

	return (
		<div className={styles.resultsContainer}>
			<h2>Результаты теста</h2>
			<div className={styles.score}>
				{correctAnswers}/{questions.length}
			</div>
			<div
				className={styles.message}
				style={{
					color:
						correctAnswers === questions.length
							? '#28a745'
							: correctAnswers >= questions.length * 0.8
							? '#17a2b8'
							: correctAnswers >= questions.length * 0.6
							? '#ffc107'
							: '#dc3545',
				}}
			>
				{getMessage()}
			</div>

			<div className={styles.stats}>
				<div className={styles.stat}>
					<div className={styles.statNumber}>{correctAnswers}</div>
					<div className={styles.statLabel}>Правильно</div>
				</div>
				<div className={styles.stat}>
					<div className={styles.statNumber}>{incorrectQuestions.length}</div>
					<div className={styles.statLabel}>Ошибок</div>
				</div>
				<div className={styles.stat}>
					<div className={styles.statNumber}>
						{formatTime(timer.minutes, timer.seconds)}
					</div>
					<div className={styles.statLabel}>Время</div>
				</div>
			</div>

			<div className={styles.resultsDetails}>
				<div className={styles.detailItem}>
					<span>Всего вопросов:</span>
					<span>{questions.length}</span>
				</div>
				<div className={styles.detailItem}>
					<span>Правильных ответов:</span>
					<span>{correctAnswers}</span>
				</div>
				<div className={styles.detailItem}>
					<span>Процент успеха:</span>
					<span>{successRate}</span>
				</div>
			</div>

			<div className={styles.actionButtons}>
				<button
					className={`${styles.button} ${styles.restartButton}`}
					onClick={onRestart}
				>
					Начать заново
				</button>
				{incorrectQuestions.length > 0 && (
					<button
						className={`${styles.button} ${styles.practiceButton}`}
						onClick={onPracticeMode}
					>
						Тренировка ошибок
					</button>
				)}
			</div>
		</div>
	)
}

export default ResultsComponent
