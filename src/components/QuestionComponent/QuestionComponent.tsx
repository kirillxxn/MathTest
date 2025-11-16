import React from 'react'
import type { Question } from '../../shared/types/types'
import styles from '..//GeometryTest/GeometryTest.module.css'

type QuestionComponentProps = {
	question: Question
	userAnswer: number | number[] | null
	userSelections: number[] | null
	onAnswerSelect: (optionIndex: number) => void
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
	question,
	userAnswer,
	userSelections,
	onAnswerSelect,
}) => {
	const isSelected = (optionIndex: number): boolean => {
		if (question.multiple) {
			return userSelections?.includes(optionIndex) || false
		}
		return userAnswer === optionIndex
	}

	return (
		<div className={styles.questionContainer}>
			<div className={styles.questionText}>{question.question}</div>

			{question.multiple && (
				<div className={styles.multipleHint}>
					Выберите один или несколько вариантов
				</div>
			)}

			<div className={styles.optionsContainer}>
				{question.options.map((option, optionIndex) => (
					<div
						key={optionIndex}
						className={`${styles.option} ${
							isSelected(optionIndex) ? styles.selected : ''
						}`}
						onClick={() => onAnswerSelect(optionIndex)}
					>
						<span className={styles.optionNumber}>{optionIndex + 1}</span>
						{option}
					</div>
				))}
			</div>
		</div>
	)
}

export default QuestionComponent
